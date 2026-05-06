// API Configuration
const API_BASE_URL = 'http://localhost:9000';

// Load dashboard data when page loads
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/' || window.location.pathname === '/home') {
        loadDashboardData();
        loadRecentUsers();
        loadSuggestions();
    }
});

// Load statistics for dashboard
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const users = await response.json();

        if (Array.isArray(users)) {
            // Update total users
            document.getElementById('totalUsers').textContent = users.length;

            // Calculate average age
            const totalAge = users.reduce((sum, user) => sum + (user.age || 0), 0);
            const avgAge = users.length > 0 ? Math.round(totalAge / users.length) : 0;
            document.getElementById('avgAge').textContent = avgAge;

            // Count unique places
            const uniquePlaces = [...new Set(users.map(user => user.place))];
            document.getElementById('totalPlaces').textContent = uniquePlaces.length;

            // Count recent users (last 30 days - for demo, just show last 5)
            const recentCount = Math.min(users.length, 5);
            document.getElementById('recentCount').textContent = recentCount;
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading statistics', 'error');
    }
}

// Load recent users
async function loadRecentUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const users = await response.json();

        const recentUsersList = document.getElementById('recentUsersList');

        if (Array.isArray(users) && users.length > 0) {
            // Get last 5 users (most recent)
            const recentUsers = users.slice(-5).reverse();

            recentUsersList.innerHTML = recentUsers.map(user => `
        <tr>
          <td><strong>${escapeHtml(user.name)}</strong></td>
          <td>${user.age}</td>
          <td>${escapeHtml(user.place)}</td>
        </tr>
      `).join('');
        } else {
            recentUsersList.innerHTML = `
        <tr>
          <td colspan="3" class="text-center">No users found. <a href="/adduser">Add your first user!</a></td>
        </tr>
      `;
        }
    } catch (error) {
        console.error('Error loading recent users:', error);
        document.getElementById('recentUsersList').innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-danger">Error loading users</td>
      </tr>
    `;
    }
}

// Load personalized suggestions
async function loadSuggestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const users = await response.json();

        const suggestionsContainer = document.getElementById('suggestionsList');
        const suggestions = generateSuggestions(users);

        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
      <div class="suggestion-item" onclick="handleSuggestionClick('${suggestion.action}')">
        <div class="d-flex align-items-center">
          <div class="suggestion-icon">${suggestion.icon}</div>
          <div>
            <strong>${suggestion.title}</strong>
            <p class="mb-0 small">${suggestion.description}</p>
          </div>
        </div>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error loading suggestions:', error);
        document.getElementById('suggestionsList').innerHTML = `
      <div class="text-center text-muted">
        <p>Unable to load suggestions</p>
      </div>
    `;
    }
}

// Generate intelligent suggestions based on data
function generateSuggestions(users) {
    const suggestions = [];

    if (!users || users.length === 0) {
        suggestions.push({
            icon: '➕',
            title: 'Add Your First User',
            description: 'Get started by adding a new user to the system',
            action: 'adduser'
        });
    } else {
        // Suggestion 1: Based on user count
        if (users.length < 5) {
            suggestions.push({
                icon: '👥',
                title: 'Build Your Community',
                description: `You only have ${users.length} users. Add more to grow your database!`,
                action: 'adduser'
            });
        } else if (users.length > 20) {
            suggestions.push({
                icon: '📊',
                title: 'Great Growth!',
                description: `You have ${users.length} users! Consider exporting data for analysis`,
                action: 'showuser'
            });
        }

        // Suggestion 2: Based on age analysis
        const avgAge = users.reduce((sum, u) => sum + u.age, 0) / users.length;
        if (avgAge < 25) {
            suggestions.push({
                icon: '🎓',
                title: 'Young User Base',
                description: 'Your users are mostly young. Consider youth-focused features',
                action: 'showuser'
            });
        } else if (avgAge > 50) {
            suggestions.push({
                icon: '👴',
                title: 'Experienced Users',
                description: 'Senior user base detected. Consider accessibility features',
                action: 'showuser'
            });
        }

        // Suggestion 3: Geographic diversity
        const places = [...new Set(users.map(u => u.place))];
        if (places.length === 1) {
            suggestions.push({
                icon: '📍',
                title: 'Expand Geographic Reach',
                description: `All users are from ${places[0]}. Try to reach other locations!`,
                action: 'adduser'
            });
        } else if (places.length > 3) {
            suggestions.push({
                icon: '🌍',
                title: 'Great Diversity!',
                description: `Users from ${places.length} different locations. Well done!`,
                action: 'showuser'
            });
        }
    }

    // Always add a helpful tip
    suggestions.push({
        icon: '💡',
        title: 'Quick Tip',
        description: 'You can edit or delete users from the user list page',
        action: 'showuser'
    });

    return suggestions.slice(0, 4); // Return top 4 suggestions
}

// Handle suggestion clicks
function handleSuggestionClick(action) {
    switch (action) {
        case 'adduser':
            window.location.href = '/adduser';
            break;
        case 'showuser':
            window.location.href = '/showuser';
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.style.background = type === 'error' ? '#dc3545' : '#28a745';
    notification.style.color = 'white';
    notification.innerHTML = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Refresh dashboard data (for real-time updates)
function refreshDashboard() {
    loadDashboardData();
    loadRecentUsers();
    loadSuggestions();
}

// Auto-refresh every 30 seconds
if (window.location.pathname === '/' || window.location.pathname === '/home') {
    setInterval(refreshDashboard, 30000);
}

// Form validation helper
function validateForm(formData) {
    if (!formData.name || formData.name.trim() === '') {
        showNotification('Name is required!', 'error');
        return false;
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
        showNotification('Please enter a valid age (1-120)!', 'error');
        return false;
    }

    if (!formData.place || formData.place.trim() === '') {
        showNotification('Place is required!', 'error');
        return false;
    }

    return true;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateForm, showNotification };
}