const urlApi = "https://66f63057436827ced9762edb.mockapi.io/api/v1"
async function select(e) {
    const id = sessionStorage.getItem("userName")

    if (!id) {
        e.preventDefault();
        openPopup()
        return

    }
    const giftId = this.parentNode.id
    const url = `${urlApi}/gift/${giftId}`
    const body = { selected: this.checked, who: this.checked ? id : "" }
    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),


    });

    const user = await fetch(`${urlApi}/user/${id}`).then(res => res.json())
    const selectedItems = user.seletedItems;
    selectedItems.push(this.parentNode.id)
    const bodyUser = { seletedItems: selectedItems }
    await fetch(`${urlApi}/user/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyUser),
    })
}
fetch(`${urlApi}/gift`)
    .then(res => res.json())
    .then(products => {
        console.log(products);
        const id = sessionStorage.getItem("userName")

        let bibImage = "https://example.com/bib.jpg";
        const giftList = document.getElementById("gift-list");
        products.forEach((product) => {
            const giftItem = document.createElement("div");
            giftItem.id = product.id
            giftItem.classList.add("gift-item");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = product.selected
            checkbox.disabled = product.who && product.who != id
            console.log(product.who && product.who != id);
            checkbox.onclick = select;
            const label = document.createElement("label");
            label.textContent = product.name;

            const imageContainer = document.createElement("div");
            imageContainer.classList.add("hover-image");
            const productImage = document.createElement("img");

            productImage.src = product.image;
            imageContainer.appendChild(productImage);
            const hoverBib = document.createElement("img");
            hoverBib.src = bibImage;
            productImage.addEventListener("mouseover", function () {
                bibImage = this.src;
            });
            hoverBib.classList.add("hover-bib");
            imageContainer.appendChild(hoverBib);
            giftItem.appendChild(checkbox);
            giftItem.appendChild(label);
            giftItem.appendChild(imageContainer);
            giftList.appendChild(giftItem);
        });
    })

function closePopup() {
    document.getElementById("login-popup").style.display = "none";
    location.reload(true)
}

async function login(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const ping = document.getElementById("ping").value;
    

    const url = 'https://66f63057436827ced9762edb.mockapi.io/api/v1/user';

    try {
        const response = await fetch(url);
        const users = await response.json();

        const existingUser = users.find(user => user.name === name && user.ping == ping);

        if (existingUser) {
            sessionStorage.setItem('userId', existingUser.id);
            sessionStorage.setItem('userName', existingUser.name);

        } else {
            const newUser = { name, ping };
            const u = users.find(user => user.name == name)
            if (!existingUser && u) {
                console.log(existingUser);
                document.getElementById("exist").textContent = `Ya existe: ${u.name}; ${u.ping} `
                document.getElementById("exist").style.display = "block"

                return
            }
            const registerResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (registerResponse.ok) {
                const createdUser = await registerResponse.json();
                console.log(`User ${name} registered successfully.`);
                sessionStorage.setItem('userId', createdUser.id);
                sessionStorage.setItem('userName', createdUser.name);

            } else {
                console.error('Error registering user:', registerResponse.statusText);
            }
        }

        closePopup();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


async function openPopup() {
    document.getElementById("login-popup").style.display = "block";
    document.getElementById("login-form").onsubmit = login
}


function logout() {
    sessionStorage.removeItem('userId'); // Remove user ID from session storage
    sessionStorage.removeItem('userName'); // Remove user ID from session storage
    document.getElementById("user-info").style.display = "none"; // Hide user info
    console.log("User logged out.");
    window.location.reload(true)
}



// Function to update user info display
function updateUserInfo(userName) {

    const userId = sessionStorage.getItem('userId');
    const name = sessionStorage.getItem('userName');
    if (userId) {
        document.getElementById("user-name").innerText = name;
        document.getElementById("user-info").style.display = "block";
        document.getElementById("login-link").style.display = "none";
    } else {
        document.getElementById("user-info").style.display = "none";
        document.getElementById("login-link").style.display = "block"; // Show login link if not logged in
    }
}

// On page load, check if the user is logged in
window.onload = function () {
    const userId = sessionStorage.getItem('userId');
    updateUserInfo(userId);
};