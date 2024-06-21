document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const loginContainer = document.getElementById('login-form');
    const registerContainer = document.getElementById('register-form');
    const homePageContainer = document.getElementById('home-page');
    const contentContainer = document.getElementById('content');
    const collegeList = document.getElementById('college-list');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pageNumberSpan = document.getElementById('page-number');
    const stateFilter = document.getElementById('state-filter');
    const goToLoginButton = document.getElementById('go-to-login');
    const goToRegisterButton = document.getElementById('go-to-register');

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
        "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
        "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
        "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", 
        "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
    ];

    let currentPage = 1;
    let totalPages = 1;
    let currentSearch = '';

    goToLoginButton.addEventListener('click', () => {
        homePageContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    goToRegisterButton.addEventListener('click', () => {
        homePageContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Login successful') {
                showColleges();
            } else {
                alert(data.message);
            }
        });
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        });
    });

    searchBar.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        currentPage = 1;
        showColleges();
    });

    searchButton.addEventListener('click', () => {
        currentSearch = searchBar.value;
        currentPage = 1;
        showColleges();
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showColleges();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            showColleges();
        }
    });

    stateFilter.addEventListener('change', () => {
        currentPage = 1;
        showColleges();
    });

    function populateStateFilter() {
        indianStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        });
    }

    function showColleges() {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'none';
        homePageContainer.style.display = 'none';
        contentContainer.style.display = 'block';
        
        const state = stateFilter.value;

        fetch(`/colleges?page=${currentPage}&search=${currentSearch}&state=${state}`)
        .then(response => response.json())
        .then(data => {
            collegeList.innerHTML = '';
            data.colleges.forEach(college => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${college['College Name']}</strong><br>
                                University: ${college['University Name']}<br>
                                Type: ${college['College Type']}<br>
                                State: ${college['State Name']}<br>
                                District: ${college['District Name']}`;
                collegeList.appendChild(li);
            });

            totalPages = Math.ceil(data.total / data.limit);
            pageNumberSpan.textContent = data.page;

            prevButton.disabled = data.page === 1;
            nextButton.disabled = data.page === totalPages;
        });
    }

    contentContainer.style.display = 'none';
    populateStateFilter();
});
