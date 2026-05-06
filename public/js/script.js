// API Configuration - Use relative paths
const API_BASE_URL = ''; // Empty string means use same origin

// Load dashboard data when page loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded, fetching data...');
    loadDashboardData();
    loadRecentUsers();
    loadSuggestions();
});

// Load statistics for dashboard
async function loadDashboardData() {
    try {
        console.log('Fetching users for dashboard...');
        const response = await fetch('/api/users');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        console.log('Received users:', users);

        if (Array.isArray(users) && users.length > 0) {
            // Update total users
            const totalUsersElem = document.getElementById('totalUsers');
            if (totalUsersElem) totalUsersElem.textContent = users.length;

            // Calculate average age
            const totalAge = users.reduce((sum, user) => sum + (user.age || 0), 0);
            const avgAge = users.length > 0 ? Math.round(totalAge / users.length) : 0;
            const avgAgeElem = document.getElementById('avgAge');
            if (avgAgeElem) avgAgeElem.textContent = avgAge;

            // Count unique places
            const uniquePlaces = [...new Set(users.map(user => user.place).filter(place => place))];
            const totalPlacesElem = document.getElementById('totalPlaces');
            if (totalPlacesElem) totalPlacesElem.textContent = uniquePlaces.length;

            // Count recent users (last 5)
            const recentCount = Math.min(users.length, 5);
            const recentCountElem = document.getElementById('recentCount');
            if (recentCountElem) recentCountElem.textContent = recentCount;
        } else {
            console.log('No users found');
            const totalUsersElem = document.getElementById('totalUsers');
            if (totalUsersElem) totalUsersElem.textContent = '0';
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default values on error
        const totalUsersElem = document.getElementById('totalUsers');
        if (totalUsersElem) totalUsersElem.textContent = '0';
    }
}

// Load recent users
async function loadRecentUsers() {
    try {
        console.log('Fetching recent users...');
        const response = await fetch('/api/users');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        const recentUsersList = document.getElementById('recentUsersList');

        if (!recentUsersList) return;

        if (Array.isArray(users) && users.length > 0) {
            // Get last 5 users (most recent)
            const recentUsers = users.slice(-5).reverse();

            recentUsersList.innerHTML = recentUsers.map(user => `
        <tr>
          <td><strong>${escapeHtml(user.name)}</strong>${user._id ? `<br><small class="text-muted">ID: ${String(user._id).slice(-6)}</small>` : ''}</td>
          <td>${user.age || '?'}${user.age ? ' years' : ''}</td>
          <td>${escapeHtml(user.place) || 'N/A'}</td>
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
        const recentUsersList = document.getElementById('recentUsersList');
        if (recentUsersList) {
            recentUsersList.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-danger">Error loading users. Please refresh.</td>
        </tr>
      `;
        }
    }
}

// Load personalized suggestions
async function loadSuggestions() {
    try {
        console.log('Fetching suggestions...');
        const response = await fetch('/api/users');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        const suggestionsContainer = document.getElementById('suggestionsList');

        if (!suggestionsContainer) return;

        const suggestions = generateSuggestions(users);

        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
      <div class="suggestion-item" onclick="window.location.href='${suggestion.action}'">
        <div class="d-flex align-items-center">
          <div class="suggestion-icon" style="font-size: 2rem; margin-right: 15px;">${suggestion.icon}</div>
          <div>
            <strong>${suggestion.title}</strong>
            <p class="mb-0 small text-muted">${suggestion.description}</p>
          </div>
        </div>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error loading suggestions:', error);
        const suggestionsContainer = document.getElementById('suggestionsList');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = `
        <div class="text-center text-muted">
          <p>Unable to load suggestions</p>
          <a href="/adduser" class="btn-sm btn-primary">Add User</a>
        </div>
      `;
        }
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
            action: '/adduser'
        });
    } else {
        // Suggestion 1: Based on user count
        if (users.length < 5) {
            suggestions.push({
                icon: '👥',
                title: 'Build Your Community',
                description: `You only have ${users.length} users. Add more to grow your database!`,
                action: '/adduser'
            });
        } else if (users.length > 20) {
            suggestions.push({
                icon: '📊',
                title: 'Great Growth!',
                description: `You have ${users.length} users! Consider exporting data for analysis`,
                action: '/showuser'
            });
        }

        // Suggestion 2: Based on age analysis
        const avgAge = users.reduce((sum, u) => sum + (u.age || 0), 0) / users.length;
        if (avgAge < 25 && users.length > 0) {
            suggestions.push({
                icon: '🎓',
                title: 'Young User Base',
                description: 'Your users are mostly young. Consider youth-focused features',
                action: '/showuser'
            });
        } else if (avgAge > 50 && users.length > 0) {
            suggestions.push({
                icon: '👴',
                title: 'Experienced Users',
                description: 'Senior user base detected. Consider accessibility features',
                action: '/showuser'
            });
        }

        // Suggestion 3: Geographic diversity
        const places = [...new Set(users.map(u => u.place).filter(p => p))];
        if (places.length === 1 && users.length > 0) {
            suggestions.push({
                icon: '📍',
                title: 'Expand Geographic Reach',
                description: `All users are from ${places[0]}. Try to reach other locations!`,
                action: '/adduser'
            });
        } else if (places.length > 3 && users.length > 0) {
            suggestions.push({
                icon: '🌍',
                title: 'Great Diversity!',
                description: `Users from ${places.length} different locations. Well done!`,
                action: '/showuser'
            });
        }
    }

    // Always add a helpful tip
    suggestions.push({
        icon: '💡',
        title: 'Quick Tip',
        description: 'You can edit or delete users from the user list page',
        action: '/showuser'
    });

    return suggestions.slice(0, 4); // Return top 4 suggestions
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification (optional)
function showNotification(message, type = 'info') {
    console.log(`${type}: ${message}`);
    // You can uncomment this if you want toast notifications
    /*
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'error' ? '#dc3545' : '#28a745'};
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      z-index: 1000;
    `;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
    */
}

// Refresh dashboard data
function refreshDashboard() {
    loadDashboardData();
    loadRecentUsers();
    loadSuggestions();
}

// Auto-refresh every 30 seconds
if (window.location.pathname === '/' || window.location.pathname === '/home') {
    setInterval(refreshDashboard, 30000);
}