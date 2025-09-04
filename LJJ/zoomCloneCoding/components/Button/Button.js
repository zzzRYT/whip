export default function Button(text, onClick, className = 'custom-button') {
    const button = document.createElement('button');
    button.className = className;
    button.textContent = text;
    button.onclick = onClick;
    return button;
}
