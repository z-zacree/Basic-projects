function showMain() {
    $("#signUpModal").modal("hide");
    $("#loginPage").hide();
    $("#mainPage, #signOutBtn").show();
    populateMain();
}
function showLogin() {
    $("#loginPage").show();
    $("#mainPage, #signOutBtn").hide();
}

$(() => {
    // initial view set up
    const isLoggedIn = sessionStorage.getItem("account");

    if (isLoggedIn) showMain();
    else showLogin();

    // sign up and log in form
    $("#signUpForm").submit(function (e) {
        e.preventDefault();

        const formData = formFormat($(this).serializeArray());

        if (localStorage.getItem(formData.username)) {
            $("#signUpWarn").show();
        } else {
            let data = {
                username: formData.username,
                password: formData.password,
                tasks: [],
            };

            localStorage.setItem(formData.username, JSON.stringify(data));
            sessionStorage.setItem("account", formData.username);
            showMain();
        }
    });

    $("#loginForm").submit(function (e) {
        e.preventDefault();

        const formData = formFormat($(this).serializeArray());

        const user = JSON.parse(localStorage.getItem(formData.username));

        if (user) {
            if (formData.password == user.password) {
                sessionStorage.setItem("account", formData.username);
                $(this).trigger("reset");
                showMain();
            } else $("#loginWarn").show();
        } else {
            $("#loginWarn").show();
        }
    });

    // reset sign up modal
    $("#signUpModal").on("hidden.bs.modal", function () {
        $(this).find("form").trigger("reset");
        $("#signUpWarn").hide();
    });

    // sign out
    $("#signOutBtn").click(function () {
        sessionStorage.clear();
        showLogin();
    });

    // create task form
    $("#createTaskForm").submit(function (e) {
        e.preventDefault();

        let formData = formFormat($(this).serializeArray());
        formData.categories = getCat($(".category"));

        const userData = JSON.parse(localStorage.getItem(sessionStorage.getItem("account")));
        userData.tasks.push(formData);
        localStorage.setItem(userData.username, JSON.stringify(userData));

        $("#createTaskModal").modal("hide");
        $("#createTaskModal").find("form").trigger("reset");
        $("#createTaskModal").find("#categories").empty();
        populateMain();
    });

    // create categories button
    $("#createCatBtn").click(function () {
        if (getCat($(".category-add")).length < 5) {
            $("#categories").prepend(`
                <div class="category-body category-add mx-1" id='category-add'>
                    <span class="category px-1" contenteditable="true" id='ca-text'>New</span>
                    <button type="button" class="category-btn" id='ca-cancel'>&times;</button>
                </div>
            `);

            $("#ca-cancel").click(function () {
                $(this).parent().replaceWith("");
            });

            $("#ca-text").keypress(function (e) {
                return e.which != 13;
            });
        }
    });
});

function formFormat(rawData) {
    let formData = {};
    $(rawData).each(function (index, data) {
        formData[data.name] = data.value;
    });

    return formData;
}

function getCat(rawData) {
    let categories = [];
    $(rawData).each(function () {
        categories.push($(this).text());
    });

    return categories;
}

function populateMain() {
    $("#completed-tasks, #incomplete-tasks").empty();

    const user = JSON.parse(localStorage.getItem(sessionStorage.getItem("account")));
    if (!user) showLogin();

    const tasks = user.tasks;

    if (tasks.length == 0) {
        $("#incomplete-tasks, #completed-tasks").html("No tasks! Create one now!");
        return;
    }

    tasks.map((task, index) => {
        if (task.status) {
            $("#completed-tasks").append(`
                <div class="card w-100 my-3">
                    <div class="card-header d-flex align-items-center">
                        ${task.categories
                            .map((cat, index) => {
                                return `
                                    <div class="category-body mx-1">
                                        <span class="px-1" id='ca-text'>${cat}</span>
                                    </div>
                                `;
                            })
                            .join("")}
                            <button class='btn btn-warning ml-auto' type='button' id='mai-btn-${index}'>Mark as incomplete</button>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                    </div>
                </div>
            `);

            $(`#mai-btn-${index}`).click(function () {
                tasks[index].status = false;
                localStorage.setItem(user.username, JSON.stringify(user));
                populateMain();
            });
        } else {
            $("#incomplete-tasks").append(`
                <div class="card w-100 my-3">
                    <div class="card-header d-flex align-items-center">
                        ${task.categories
                            .map((cat, index) => {
                                return `
                                    <div class="category-body mx-1">
                                        <span class="px-1" id='ca-text'>${cat}</span>
                                    </div>
                                `;
                            })
                            .join("")}
                            <button class='btn btn-warning ml-auto' type='button' id='mad-btn-${index}'>Mark as done</button>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                    </div>
                </div>
            `);

            $(`#mad-btn-${index}`).click(function () {
                tasks[index].status = true;
                localStorage.setItem(user.username, JSON.stringify(user));
                populateMain();
            });
        }
    });
}
