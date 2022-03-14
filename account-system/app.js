function showMain() {
    $("#loginPage").hide();
    $("#mainPage, #signOutBtn").show();
    $("#signUpModal").modal("hide");
}

function showLogin() {
    $("#loginPage").show();
    $("#mainPage, #signOutBtn").hide();
}

$(() => {
    // set up view on page start/reload
    const user = sessionStorage.getItem("account");
    if (user) showMain();
    else showLogin();

    // sign up and log in form
    $("#signUpForm").submit(function (e) {
        e.preventDefault();

        const formData = formFormat($(this).serializeArray());

        if (localStorage.getItem(formData.username)) {
            $("#signUpWarn").show();
        } else {
            const data = {
                username: formData.username,
                password: formData.password,
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
            } else {
                $("#loginWarn").show();
            }
        } else {
            $("#loginWarn").show();
        }
    });

    // resets sign up form on modal close
    $("#signUpModal").on("hidden.bs.modal", function () {
        $(this).find("form").trigger("reset");
        $("#signUpWarn").hide();
    });

    // sign out btn
    $("#signOutBtn").click(function (e) {
        e.preventDefault();

        sessionStorage.clear();
        showLogin();
    });
});

function formFormat(rawData) {
    let formData = {};
    $(rawData).each(function (index, data) {
        formData[data.name] = data.value;
    });

    return formData;
}
