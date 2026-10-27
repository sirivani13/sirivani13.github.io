# Certificates Directory

Place your official certificate PDF files in this folder to display and link them on your portfolio.

## Expected File Names

By default, the portfolio looks for the following file names in this directory:

1. **Python (Infosys Springboard)**
   - File name: `python-infosys-springboard.pdf`
   - Target path: `certificates/python-infosys-springboard.pdf`

2. **Claude 101 (Anthropic)**
   - File name: `claude-101-anthropic.pdf`
   - Target path: `certificates/claude-101-anthropic.pdf`

---

## How It Works

1. **Place your PDF files here:**
   Copy your downloaded certificate PDF files into this `certificates/` folder and name them as listed above.
   
2. **If your PDF has a different name:**
   Open `index.html` in any text editor, search for `data-pdf-path`, and update the path to match your file name:
   ```html
   <!-- Example for Python -->
   <article class="cert-card" id="cert-python" data-pdf-path="certificates/YOUR_FILE_NAME.pdf">
     ...
     <a href="certificates/YOUR_FILE_NAME.pdf" target="_blank" class="view-cert-btn">View Certificate</a>
     <a href="certificates/YOUR_FILE_NAME.pdf" download class="download-cert-btn">Download</a>
   ```

3. **Placeholder behavior:**
   If a PDF has not been placed in this folder yet, the website automatically displays:
   `"Certificate PDF not added yet."`
   and safely disables the buttons until the file is provided.

4. **Instant Browser Testing (Attach PDF):**
   You can also click the **Attach PDF** button directly on the website to select any PDF from your computer and immediately test the "View Certificate" (opens in new tab) and "Download" buttons without touching any code!
