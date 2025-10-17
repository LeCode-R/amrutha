
from flask import Flask, request, jsonify
from flask_cors import CORS
from paper2code_agent.agent import root_agent

app = Flask(__name__)
CORS(app)

@app.route("/agent", methods=["POST"])
def agent():
    data = request.get_json()
    query = data.get("query")
    if not query:
        return jsonify({"error": "Query not provided"}), 400
    
    response = root_agent.invoke(query)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
