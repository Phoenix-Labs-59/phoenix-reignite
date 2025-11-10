// Phoenix Reignite - Frontend JavaScript
const API_BASE = 'http://localhost:5000/api';
let currentSessionId = null;

// Show/Hide Sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

// Create Quiz Handler
function handleCreateQuiz(event) {
    event.preventDefault();
    const topic = document.getElementById('topic').value;
    const numQuestions = document.getElementById('numQuestions').value;
    
    // Call backend API
    fetch(`${API_BASE}/quiz/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            topic: topic,
            num_questions: numQuestions
        })
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('quizResult');
        resultDiv.innerHTML = `
            <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <h3>✅ Quiz Created!</h3>
                <p><strong>Quiz ID:</strong> ${data.quiz_id}</p>
                <p><strong>Topic:</strong> ${topic}</p>
                <p><strong>Questions:</strong> ${numQuestions}</p>
                <button class="btn btn-success" onclick="hostSession('${data.quiz_id}')">Host Live Session</button>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error creating quiz:', error);
        alert('Error creating quiz. Check console.');
    });
}

// Host a Session
function hostSession(quizId) {
    const hostName = prompt('Enter your name (host):');
    if (!hostName) return;
    
    fetch(`${API_BASE}/session/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quiz_id: quizId,
            host_name: hostName
        })
    })
    .then(response => response.json())
    .then(data => {
        currentSessionId = data.session_id;
        alert(`🎉 Session Created!\nShare Code: ${data.session_code}\nSession ID: ${data.session_id}`);
        showSection('join');
    })
    .catch(error => console.error('Error hosting session:', error));
}

// Join Session Handler
function handleJoinSession(event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;
    const sessionCode = document.getElementById('sessionCode').value;
    
    fetch(`${API_BASE}/session/${sessionCode}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player_name: playerName
        })
    })
    .then(response => response.json())
    .then(data => {
        currentSessionId = sessionCode;
        alert(`✅ Joined session! Welcome, ${playerName}!`);
        updateLeaderboard(sessionCode);
    })
    .catch(error => {
        console.error('Error joining session:', error);
        alert('Error joining session. Check session code.');
    });
}

// Update Leaderboard
function updateLeaderboard(sessionId) {
    fetch(`${API_BASE}/session/${sessionId}/leaderboard`)
        .then(response => response.json())
        .then(data => {
            const leaderboardDiv = document.getElementById('leaderboard');
            const listDiv = document.getElementById('leaderboardList');
            
            leaderboardDiv.classList.remove('hidden');
            listDiv.innerHTML = data.leaderboard.map((entry, idx) => 
                `<li><span>${idx + 1}. ${entry.player}</span><span>${entry.score} pts</span></li>`
            ).join('');
        })
        .catch(error => console.error('Error updating leaderboard:', error));
}

// Add Site to Blocklist
function addToBlocklist() {
    const site = document.getElementById('siteToBlock').value;
    if (!site) {
        alert('Please enter a website to block');
        return;
    }
    
    fetch(`${API_BASE}/distraction/blocklist/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            site: site
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('siteToBlock').value = '';
        displayBlocklist(data.blocklist);
        alert(`✅ ${site} added to blocklist!`);
    })
    .catch(error => console.error('Error adding to blocklist:', error));
}

// Display Blocklist
function displayBlocklist(sites) {
    const blockedSitesDiv = document.getElementById('blockedSites');
    blockedSitesDiv.innerHTML = sites.map(site => 
        `<div style="padding: 8px; background: #fff3cd; margin: 5px 0; border-radius: 3px;">🚫 ${site}</div>`
    ).join('');
}

// Activate Focus Mode
function activateFocusMode() {
    fetch(`${API_BASE}/distraction/blocklist`)
        .then(response => response.json())
        .then(data => {
            displayBlocklist(data.blocklist);
            alert(`🔒 Focus Mode Activated!\nBlocking ${data.count} distracting sites.\nStay focused! 📚`);
        })
        .catch(error => console.error('Error activating focus mode:', error));
}

// Get Random Roast Message
function getMotivationalRoast() {
    fetch(`${API_BASE}/roast`)
        .then(response => response.json())
        .then(data => {
            alert(data.roast);
        })
        .catch(error => console.error('Error getting roast:', error));
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    showSection('home');
    console.log('Phoenix Reignite loaded! 🔥');
});
