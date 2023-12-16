// Define the custom element
class UploadComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = `
      <style>
        .upload-container {
          display: flex;
          flex-direction: column;
          width: 300px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .upload-button {
          margin-bottom: 10px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress {
          height: 100%;
          background-color: #4caf50;
        }

        .time {
          font-size: 14px;
          margin-bottom: 10px;
        }
      </style>
      <div class="upload-container">
        <input type="file" class="upload-button" />
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
        <div class="time"></div>
      </div>
    `;
        this.uploadInput = this.shadow.querySelector("input[type='file']");
        this.progressBar = this.shadow.querySelector(".progress");
        this.timeEl = this.shadow.querySelector(".time");
    }

    connectedCallback() {
        // Add event listener for file upload
        this.uploadInput.addEventListener("change", this.handleUpload.bind(this));
    }

    handleUpload(event) {
        const file = event.target.files[0];
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload");
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("X-File-Name", file.name);
        xhr.upload.addEventListener("progress", this.handleProgress.bind(this));
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const time = new Date().toLocaleTimeString();
                this.timeEl.textContent = `Uploaded at ${time}`;
                this.progressBar.style.width = "0%";
            }
        };
        xhr.send(file);
    }

    handleProgress(event) {
        const progress = Math.round((event.loaded / event.total) * 100);
        this.progressBar.style.width = `${progress}%`;
    }
}

// Register the custom element
window.customElements.define("upload-component", UploadComponent);
