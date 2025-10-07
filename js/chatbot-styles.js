
function injectChatbotStyles() {
    const css = `
        :root { --primary-color: #007bff; }
        #chatbot-container-wrapper { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        #chatbot-container-wrapper #floating-btn-preview {
            position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
            background-color: var(--primary-color); border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2); cursor: pointer;
            transition: all 0.3s ease; z-index: 9998;
        }
        #chatbot-container-wrapper #floating-btn-preview.hidden { transform: scale(0); }
        #chatbot-container-wrapper #floating-btn-preview svg { width: 32px; height: 32px; fill: white; }
        #chatbot-container-wrapper #chat-window-preview {
            position: fixed; bottom: 90px; right: 20px; width: 350px; max-height: 500px;
            background-color: #fff; border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            display: flex; flex-direction: column; overflow: hidden;
            transform: scale(0.95) translateY(10px); opacity: 0; pointer-events: none;
            transition: all 0.3s ease; z-index: 9999;
        }
        #chatbot-container-wrapper #chat-window-preview.visible { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
        #chatbot-container-wrapper .chat-header {
            background-color: var(--primary-color); color: white; padding: 15px;
            font-weight: bold; display: flex; justify-content: space-between; align-items: center;
            flex-shrink: 0;
        }
        #chatbot-container-wrapper .chat-header-title { display: flex; align-items: center; gap: 10px; }
        #chatbot-container-wrapper .chat-header-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; background: #fff3; }
        #chatbot-container-wrapper .chat-header-close { font-size: 24px; cursor: pointer; font-family: monospace; }
        #chatbot-container-wrapper .chat-body { flex-grow: 1; padding: 15px; overflow-y: auto; background: #f4f7f9; }
        #chatbot-container-wrapper .chat-message { display: flex; margin-bottom: 15px; max-width: 90%; align-items: flex-end; gap: 8px; }
        #chatbot-container-wrapper .chat-message.bot { max-width: 85%; }
        #chatbot-container-wrapper .chat-message .avatar { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        #chatbot-container-wrapper .message-bubble { padding: 12px 15px; font-size: 15px; word-wrap: break-word; border-radius: 15px; }
        #chatbot-container-wrapper .message-bubble img, .message-bubble video, .message-bubble audio { max-width: 100%; border-radius: 10px; margin-top: 5px; }
        #chatbot-container-wrapper .message-bubble a { color: var(--primary-color); text-decoration: underline; }
        #chatbot-container-wrapper .typing-indicator { display: flex; align-items: center; gap: 5px; padding: 12px 15px; }
        #chatbot-container-wrapper .typing-indicator span { width: 8px; height: 8px; background-color: #ccc; border-radius: 50%; animation: typing 1s infinite; }
        #chatbot-container-wrapper .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        #chatbot-container-wrapper .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
        #chatbot-container-wrapper .chat-message.bot .message-bubble { background: #e9e9eb; color: #000; border-radius: 15px 15px 15px 0; }
        #chatbot-container-wrapper .chat-message.user { margin-left: auto; flex-direction: row-reverse; }
        #chatbot-container-wrapper .chat-message.user .message-bubble { background: var(--primary-color); color: #fff; border-radius: 15px 15px 0 15px; }
        #chatbot-container-wrapper .buttons-preview { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; padding-left: 38px; }
        #chatbot-container-wrapper .button-btn-preview { background: #fff; border: 1px solid var(--primary-color); color: var(--primary-color); padding: 8px 12px; border-radius: 15px; cursor: pointer; font-size: 14px; text-decoration: none; }
        #chatbot-container-wrapper .chat-footer { padding: 10px; border-top: 1px solid #eee; display: flex; gap: 10px; flex-shrink: 0; }
        #chatbot-container-wrapper .chat-footer input { flex-grow: 1; border: 1px solid #ccc; border-radius: 20px; padding: 10px 15px; font-size: 14px; }
        #chatbot-container-wrapper .chat-footer input:disabled { background: #f1f1f1; cursor: not-allowed; }
        #chatbot-container-wrapper .chat-footer button {
            background: var(--primary-color); color: white; border: none; border-radius: 50%; width: 40px; height: 40px;
            display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        @media (max-width: 400px) {
            #chatbot-container-wrapper #chat-window-preview { width: calc(100% - 20px); right: 10px; bottom: 80px; max-height: calc(100vh - 100px); }
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.id = 'chatbot-dynamic-styles';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
}