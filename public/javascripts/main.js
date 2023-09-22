const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();
socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on("message", (message) => {
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit("chatMessage", msg);
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `${users
        .map((user) => `<li>${user.username}</li>`)
        .join("")}`;
}

function outputMessage(message) {
    if (message !== "") {
        const chatContainer = document.createElement("div");
        chatContainer.classList.add("chatContainer");

        if (message.name === username) {
            chatContainer.classList.add("my_chatbox");
        } else {
            chatContainer.classList.add("other_chatbox");
        }

        //  1 - 1
        const nameTime = document.createElement("div");
        nameTime.classList.add("nameTime");
        nameTime.classList.add("grid-wide");

        nameTime.innerHTML = `<text><span class="chat_time">${message.time}</span>${message.name}</text>`;

        //  1 - 2
        const msg = document.createElement("div");
        msg.classList.add("message");
        msg.classList.add("grid-wide");
        msg.innerHTML = `<p class="meta">${message.text}`;

        //  2
        const imgbox = document.createElement("div");
        imgbox.classList.add("avatar");
        imgbox.classList.add("grid-tall");
        imgbox.innerHTML = `<img class="avatar_img" src="./images/avatar.jpg"/>`;

        document.querySelector(".chat-messages").appendChild(chatContainer);

        chatContainer.appendChild(nameTime);
        chatContainer.appendChild(msg);
        chatContainer.appendChild(imgbox);
    }
}

// 버튼 클릭 이벤트 핸들러
document.getElementById("getVirtualCameras").addEventListener("click", () => {
    const videoElement = document.getElementById("webcam");

    // 웹캠 목록 가져오기
    navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
            const cameras = devices.filter(
                (device) => device.kind === "videoinput"
            );

            if (cameras.length === 0) {
                console.error("사용 가능한 웹캠이 없습니다.");
                return;
            }

            // 특정 웹캠 선택 (첫 번째 웹캠을 선택하도록 예제 코드 작성)
            const selectedCamera = cameras[0].deviceId;
            console.log(cameras);

            // 선택한 웹캠에서 스트림 가져오기
            navigator.mediaDevices
                .getUserMedia({ video: { deviceId: selectedCamera } })
                .then((stream) => {
                    videoElement.srcObject = stream;
                })
                .catch((error) => {
                    console.error(
                        "웹캠 스트림을 가져오는 중 오류 발생:",
                        error
                    );
                });
        })
        .catch((error) => {
            console.error("웹캠 목록을 가져오는 중 오류 발생:", error);
        });

    // GET 요청을 보내는 예제
    fetch("/virtual-cameras")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // 여기에서 서버로부터 받은 데이터를 처리합니다.
        })
        .catch((error) => {
            console.error(error);
        });
});

document.getElementById("createVirtualCamera").addEventListener("click", () => {
    // POST 요청을 보내는 예제
    fetch("/create-virtual-camera", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "NewCamera" }), // 원하는 데이터를 전송할 수 있습니다.
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // 여기에서 서버로부터 받은 데이터를 처리합니다.
        })
        .catch((error) => {
            console.error(error);
        });
});

// document.getElementById("toggleVirtualCamera").addEventListener("click", () => {
//     // POST 요청을 보내는 예제
//     fetch("/toggle-virtual-camera", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: "CameraName", enabled: true }), // 원하는 데이터를 전송할 수 있습니다.
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log(data);
//             // 여기에서 서버로부터 받은 데이터를 처리합니다.
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// });
