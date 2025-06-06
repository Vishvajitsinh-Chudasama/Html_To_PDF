const generateBtn = document.getElementById('generateBtn');
const htmlFileInput = document.getElementById('htmlFile');
const messageDiv = document.getElementById('message');

function getCSRFToken() {
    let name = 'csrftoken';
    let cookieValue = null;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
    return cookieValue;
}

generateBtn.addEventListener('click', () => {
  const file = htmlFileInput.files[0];
  if (!file) {
    messageDiv.textContent = 'Please select an HTML file first.';
    return;
  }

  messageDiv.textContent = 'Uploading and generating PDF... Please wait.';

  const formData = new FormData();
  formData.append('file', file);

  fetch('/', {
    method: 'POST',
    body: formData,
    headers: {
    'X-CSRFToken': getCSRFToken()
  },

  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Use the same name as uploaded file but with .pdf extension
      const pdfFileName = file.name.replace(/\.html?$/i, '') + '.pdf';
      a.download = pdfFileName;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      messageDiv.textContent = 'PDF generated and downloaded successfully!';
    })
    .catch(error => {
      console.error('Error:', error);
      messageDiv.textContent = 'Failed to generate PDF. Please try again.';
    });
});
