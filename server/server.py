import os
from flask import Flask, jsonify, request
from supabase import create_client
from dotenv import load_dotenv
from flask_cors import CORS
import requests
import bcrypt

load_dotenv()

app = Flask(__name__)
CORS(app)

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

@app.route('/sign-up-user', methods=['POST'])
def signUpUser():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    fullname = data.get("name")
    
    if not email or not password or not fullname:
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    try:
        supabase.table("users").insert({
            "email": email,
            "password": hashed_password, 
            "fullname": fullname,
        }).execute()
        return jsonify({"message": "User signed up successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/login-user', methods=['POST'])
def loginUser():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        response = supabase.table("users").select("*").eq("email", email).execute()
        if response.data and len(response.data) > 0:
            user = response.data[0]
            if bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
                return jsonify({"message": "Login successful", "user": user}), 200
            else:
                return jsonify({"error": "Invalid credentials"}), 401
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

stored_token = "NO TOKEN"

@app.route('/store-token', methods=['POST'])
def store_token():
    global stored_token
    try:
        data = request.get_json()

        if not data or "userID" not in data:
            return jsonify({"error": "userID is required"}), 400

        token = data.get("userID")  
        stored_token = token

        return jsonify({"message": "Token stored successfully!"}), 200

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

@app.route('/get-token', methods=['GET'])
def get_token():
    try:
        if not stored_token:
            return jsonify({"error": "Token not found"}), 404

        return jsonify({"token": stored_token}), 200

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

@app.route('/get-name', methods=['POST'])
def get_name():
    data = request.get_json()
    userID = data.get("id")
    try:
        response = supabase.table("users").select("fullname").eq("id", userID).execute()
        
        if response.data:
            fullname = response.data[0]["fullname"]
            return jsonify({"fullname": fullname}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500
    
@app.route('/logout', methods=['GET'])
def logout():
    global stored_token
    try:
        stored_token = "NO TOKEN"
        return jsonify({"message": "Logged out successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

@app.route('/update-user-info', methods=['POST'])
def updateUserInfo():
    data = request.get_json()
    user_id = data.get("id")
    email = data.get("email")
    password = data.get("password")
    fullname = data.get("fullname")

    if not email or not password or not fullname:
        return jsonify({"error": "All fields (email, password, fullname) are required"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    try:
        response = supabase.table("users").update({
            "email": email,
            "password": hashed_password,  # Note: Ensure that the password is hashed before storing it
            "fullname": fullname
        }).eq("id", user_id).execute()  # Replace `user_id` with the actual user ID

        if response.data:
            return jsonify({"message": "User information updated successfully"}), 200
        else:
            return jsonify({"message": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

@app.route('/popular-recipes-testmode')
def getPopularRecipes():
    url = os.environ.get("X-RAPIDAPI-URL")

    querystring = {"limit":"24","start":"0"}

    headers = {
        "x-rapidapi-key": os.environ.get("X-RAPIDAPI-KEY"),
        "x-rapidapi-host": os.environ.get("X-RAPIDAPI-HOST")
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status() 
        return jsonify(response.json()), response.status_code

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/save-recipe', methods=['POST'])
def saveRecipe():
    data = request.get_json()
    
    imgULR = data.get("img")
    dishTitle = data.get("title")
    prepTime = data.get("time")
    serving = data.get("serving")
    rating = data.get("rating")
    link = data.get("link")
    userID = data.get("id")

    if not all([dishTitle, prepTime, serving, rating, link, userID]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        supabase.table("saved_recipes").insert({
            "img": imgULR,
            "title": dishTitle, 
            "time": prepTime, 
            "serving": serving, 
            "rating": rating, 
            "link": link, 
            "user_id": userID
        }).execute()
        return jsonify({"message": "Recipe Saved!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/saved-recipes', methods=['POST'])
def getSavedRecipes():
    data = request.get_json()
    userID = data.get("id")

    try:
        response = (
            supabase.table("saved_recipes")
            .select("*")
            .eq("user_id", userID)
            .eq("archive", False)  
            .execute()
        )
        
        if response.data:
            return jsonify({"saved_recipes": response.data}), 200
        else:
            return jsonify({"message": "No saved recipes found"}), 404

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

@app.route('/delete-saved-recipe', methods=['POST'])
def removeSavedRecipe():
    data = request.get_json()
    recipe_id = data.get("id")

    if not recipe_id:
        return jsonify({"error": "No recipe ID provided"}), 400

    try:
        
        response = (
            supabase.table("saved_recipes")
            .update({"archive": True})
            .eq("id", recipe_id)
            .execute()
        )

        if response.data:
            return jsonify({"message": "Recipe deleted successfully"}), 200
        else:
            return jsonify({"message": "Recipe not found"}), 404

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500




if __name__ == "__main__":
    app.run(debug=True)
