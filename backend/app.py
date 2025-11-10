from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Store sessions and quizzes in memory (use database in production)
quiz_sessions = {}
quizzes = {}
user_scores = {}

# Anti-distraction blocklist
block_list = {
    "youtube.com",
    "instagram.com",
    "tiktok.com",
    "facebook.com",
    "twitter.com",
    "twitch.tv"
}

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'Welcome to Phoenix Reignite API',
        'version': '1.0.0',
        'features': ['Quiz Generation', 'Live Sessions', 'Anti-Distraction']
    })

@app.route('/api/quiz/create', methods=['POST'])
def create_quiz():
    """Create a new quiz"""
    data = request.json
    topic = data.get('topic')
    num_questions = data.get('num_questions', 10)
    
    quiz_id = f"quiz_{len(quizzes) + 1}"
    quizzes[quiz_id] = {
        'id': quiz_id,
        'topic': topic,
        'questions': [],
        'created_at': datetime.now().isoformat(),
        'num_questions': num_questions
    }
    
    return jsonify({
        'status': 'success',
        'quiz_id': quiz_id,
        'message': f'Quiz created for topic: {topic}'
    }), 201

@app.route('/api/session/create', methods=['POST'])
def create_session():
    """Create a live quiz session"""
    data = request.json
    quiz_id = data.get('quiz_id')
    host_name = data.get('host_name')
    
    session_id = f"session_{len(quiz_sessions) + 1}"
    quiz_sessions[session_id] = {
        'id': session_id,
        'quiz_id': quiz_id,
        'host': host_name,
        'players': [host_name],
        'started': False,
        'created_at': datetime.now().isoformat()
    }
    
    return jsonify({
        'status': 'success',
        'session_id': session_id,
        'session_code': session_id[-4:].upper(),
        'message': 'Live session created!'
    }), 201

@app.route('/api/session/<session_id>/join', methods=['POST'])
def join_session(session_id):
    """Join an existing session"""
    data = request.json
    player_name = data.get('player_name')
    
    if session_id in quiz_sessions:
        quiz_sessions[session_id]['players'].append(player_name)
        return jsonify({
            'status': 'success',
            'message': f'{player_name} joined the session!',
            'players': quiz_sessions[session_id]['players']
        }), 200
    
    return jsonify({'status': 'error', 'message': 'Session not found'}), 404

@app.route('/api/session/<session_id>/leaderboard', methods=['GET'])
def get_leaderboard(session_id):
    """Get live leaderboard"""
    if session_id in quiz_sessions:
        session = quiz_sessions[session_id]
        leaderboard = sorted(
            user_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]
        
        return jsonify({
            'status': 'success',
            'session_id': session_id,
            'leaderboard': [{'player': p, 'score': s} for p, s in leaderboard]
        }), 200
    
    return jsonify({'status': 'error', 'message': 'Session not found'}), 404

@app.route('/api/distraction/check', methods=['POST'])
def check_distraction():
    """Check if a website is on the blocklist"""
    data = request.json
    url = data.get('url', '').lower()
    
    is_blocked = any(domain in url for domain in block_list)
    
    return jsonify({
        'status': 'success',
        'url': url,
        'is_blocked': is_blocked,
        'message': 'Stay focused! This site is blocked during study time.' if is_blocked else 'Safe to browse!'
    }), 200

@app.route('/api/distraction/blocklist', methods=['GET'])
def get_blocklist():
    """Get the current blocklist"""
    return jsonify({
        'status': 'success',
        'blocklist': list(block_list),
        'count': len(block_list)
    }), 200

@app.route('/api/distraction/blocklist/add', methods=['POST'])
def add_to_blocklist():
    """Add a site to the blocklist"""
    data = request.json
    site = data.get('site', '').lower()
    
    if site:
        block_list.add(site)
        return jsonify({
            'status': 'success',
            'message': f'{site} added to blocklist',
            'blocklist': list(block_list)
        }), 201
    
    return jsonify({'status': 'error', 'message': 'Invalid site'}), 400

@app.route('/api/roast', methods=['GET'])
def get_roast():
    """Get a fun roast message"""
    roasts = [
        "🔥 Trying to escape? Not on our watch!",
        "🚫 Nope! Focus on your quiz instead!",
        "📚 Stop procrastinating and ace that quiz!",
        "😤 Come on, you got this! No distractions!",
        "🎯 Stay strong! The quiz won't take itself!",
        "💪 This site is blocked. Your future self thanks you!",
        "⏰ Time to focus! Distractions are not welcome here.",
        "🏆 Champions stay focused. Be a champion!"
    ]
    
    import random
    return jsonify({
        'status': 'success',
        'roast': random.choice(roasts)
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'status': 'error', 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
