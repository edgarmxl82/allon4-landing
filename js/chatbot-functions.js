const chatbotFlowState = {
  "general": {
    "mainColor": "#007bff",
    "avatarUrl": "",
    "headerTitle": "Asistente Dental Virtual",
    "chatbotName": "Asistente Virtual",
    "randomChatbotNames": "",
    "randomChatbotNamesEnabled": false,
    "businessName": "Clínica Dental Sonrisa Perfecta",
    "chatbotEnabled": true
  },
  "knowledgeBase": [
    {
      "id": 1,
      "keywords": "horario, horarios, abre",
      "response": "Nuestra clínica está abierta de Lunes a Viernes de 9:00 a 18:00.",
      "intension": "informacional"
    }
  ],
  "keywordGroups": [],
  "steps": [
    {
      "id": "wildcard_1",
      "type": "wildcard",
      "name": "Respuesta General",
      "blocks": [
        {
          "type": "text",
          "content": "No he entendido tu pregunta. ¿Podrías reformularla? Si lo prefieres, puedes seleccionar una de estas opciones.",
          "buttons": [
            {
              "type": "next_step",
              "text": "Agendar una Cita",
              "targetStepId": "welcome"
            },
            {
              "type": "next_step",
              "text": "Nuestros Servicios",
              "targetStepId": "welcome"
            }
          ]
        }
      ]
    },
    {
      "id": "welcome",
      "type": "standard",
      "name": "Mensaje de Bienvenida",
      "blocks": [
        {
          "type": "text",
          "content": "¡Hola! 👋 Bienvenido a Clínica Dental Sonrisa Perfecta. Soy Asistente Virtual, tu asistente virtual. ¿Cómo puedo ayudarte hoy?",
          "buttons": [
            {
              "type": "next_step",
              "text": "Agendar una Cita",
              "targetStepId": null
            },
            {
              "type": "next_step",
              "text": "Nuestros Servicios",
              "targetStepId": null
            },
            {
              "type": "next_step",
              "text": "Tengo una pregunta",
              "targetStepId": null
            }
          ]
        }
      ]
    }
  ]
};

class Chatbot {
    constructor(flowState) {
        this.flowState = flowState;
        this.config = flowState.general;
        this.containerId = 'chatbot-container-wrapper';

        this.session = {};
        this.dom = {}; // To store DOM element references

        // Autobind methods that will be used as event handlers
        this.handleSend = this.handleSend.bind(this);
        this.handlePreviewButtonClick = this.handlePreviewButtonClick.bind(this);

        this._init();
    }

    _init() {
        if (document.getElementById(this.containerId)) {
            console.warn("Chatbot container already exists. Skipping initialization.");
            return;
        }

        const initProcess = () => {
            this._createContainer();
            this._injectHTML();
            this._mapDOMReferences();
            this._applyInitialConfig();
            this._attachEventListeners();
            this.startSession();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProcess);
        } else {
            initProcess();
        }
    }

    _createContainer() {
        this.container = document.createElement('div');
        this.container.id = this.containerId;
        document.body.appendChild(this.container);
    }

    _injectHTML() {
        this.container.innerHTML = `
            <div id="floating-btn-preview">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2z"></path></svg>
            </div>
            <div id="chat-window-preview">
                <div class="chat-header">
                    <div class="chat-header-title">
                        <img id="chat-header-avatar-preview" class="chat-header-avatar" alt="Avatar">
                        <span id="chat-header-text-preview"></span>
                    </div>
                    <span class="chat-header-close">&times;</span>
                </div>
                <div class="chat-body" id="chat-body-preview"></div>
                <div class="chat-footer">
                    <input type="text" id="chat-user-input-preview" placeholder="Escribe tu mensaje...">
                    <button id="chat-send-btn-preview">
                        <svg viewBox="0 0 24 24" style="fill:white;"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }

    _mapDOMReferences() {
        this.dom.floatingBtn = this.container.querySelector('#floating-btn-preview');
        this.dom.chatWindow = this.container.querySelector('#chat-window-preview');
        this.dom.chatAvatar = this.container.querySelector('#chat-header-avatar-preview');
        this.dom.chatHeader = this.container.querySelector('#chat-header-text-preview');
        this.dom.chatBody = this.container.querySelector('#chat-body-preview');
        this.dom.userInput = this.container.querySelector('#chat-user-input-preview');
        this.dom.sendBtn = this.container.querySelector('#chat-send-btn-preview');
        this.dom.closeBtn = this.container.querySelector('.chat-header-close');
    }

    _applyInitialConfig() {
        this.dom.floatingBtn.classList.toggle('hidden', !this.config.chatbotEnabled);
        this.dom.chatHeader.textContent = this.config.headerTitle;
        this.dom.chatAvatar.src = this.config.avatarUrl;
        this.dom.chatAvatar.style.display = this.config.avatarUrl ? 'block' : 'none';
    }

    _attachEventListeners() {
        this.dom.floatingBtn.addEventListener('click', () => this.dom.chatWindow.classList.toggle('visible'));
        this.dom.closeBtn.addEventListener('click', () => this.dom.chatWindow.classList.remove('visible'));
        this.dom.sendBtn.addEventListener('click', this.handleSend);
        this.dom.userInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSend();
            }
        });
        this.dom.chatBody.addEventListener('click', this.handlePreviewButtonClick);
    }

    _replaceVars(text) {
        if (typeof text !== 'string') return text;
        const allVariables = { ...this.session.variables, chatbot_name: this.config.chatbotName, random_chatbot_name: this.session.variables.random_chatbot_name, business_name: this.config.businessName };
        return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => allVariables[varName] || '');
    }

    _addTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing-message';
        typingDiv.innerHTML = `<img src="${this.config.avatarUrl}" class="avatar" style="display: ${this.config.avatarUrl ? 'block' : 'none'};"><div class="message-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
        this.dom.chatBody.appendChild(typingDiv);
        this.dom.chatBody.scrollTop = this.dom.chatBody.scrollHeight;
    }

    _removeTyping() {
        const typingMsg = this.dom.chatBody.querySelector('.typing-message');
        if (typingMsg) typingMsg.remove();
    }

    _addMessage(sender, text, buttons = []) {
        if (!text && sender === 'bot') return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        if (sender === 'bot') {
            const avatar = document.createElement('img');
            avatar.src = this.config.avatarUrl;
            avatar.className = 'avatar';
            avatar.style.display = this.config.avatarUrl ? 'block' : 'none';
            messageDiv.appendChild(avatar);
        }
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = this._replaceVars(text).replace(/\n/g, '<br>');
        messageDiv.appendChild(bubble);
        this.dom.chatBody.appendChild(messageDiv);
        if (buttons.length > 0) {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-preview';
            buttons.forEach(button => {
                const btnEl = document.createElement('a');
                btnEl.className = 'button-btn-preview';
                btnEl.textContent = this._replaceVars(button.text);
                btnEl.href = button.type === 'web_url' ? button.url : '#';
                btnEl.target = button.type === 'web_url' ? '_blank' : '_self';
                if(button.targetStepId) btnEl.dataset.targetStepId = button.targetStepId;
                buttonsContainer.appendChild(btnEl);
            });
            this.dom.chatBody.appendChild(buttonsContainer);
        }
        this.dom.chatBody.scrollTop = this.dom.chatBody.scrollHeight;
    }

    async _processBlocks(blocks, startIndex = 0) {
        this.container.querySelectorAll('.buttons-preview').forEach(el => el.remove());
        this.dom.userInput.disabled = true;
        this.dom.userInput.placeholder = 'Escribe tu mensaje...';
        this.session.waitingForInput = null;
        this.session.waitingForKeywordMatch = null;

        for (let i = startIndex; i < blocks.length; i++) {
            const block = blocks[i];
            const processedMessage = this._replaceVars(block.message || block.content);
            switch (block.type) {
                case 'text': this._addMessage('bot', processedMessage, block.buttons); break;
                case 'delay':
                    this._addTyping();
                    await new Promise(r => setTimeout(r, (block.duration || 1) * 1000));
                    this._removeTyping();
                    break;
                case 'user_input':
                    this._addMessage('bot', processedMessage);
                    this.dom.userInput.disabled = false;
                    this.dom.userInput.placeholder = `Introduce tu ${block.variableName || 'respuesta'}...`;
                    if (this.session.waitingForInput && this.session.waitingForInput.timeoutId) clearTimeout(this.session.waitingForInput.timeoutId);
                    const validationType = block.validateName ? 'name' : (block.validateEmail ? 'email' : (block.validatePhone ? 'phone' : null));
                    const waitingState = { block, variableName: block.variableName, validationType, validationState: 'awaiting_initial', initialValue: null, attempts: 0, timeoutId: null };
                    if (block.retryEnabled) waitingState.timeoutId = setTimeout(() => this._addMessage('bot', this._replaceVars(block.retryMessage)), (block.retrySeconds || 30) * 1000);
                    this.session.waitingForInput = waitingState;
                    return;
                case 'keywords':
                    this.dom.userInput.disabled = false;
                    this.dom.userInput.placeholder = 'Escribe tu consulta...';
                    this.session.waitingForKeywordMatch = { block, blockIndex: i };
                    break;
            }
        }
    }

    async handleTransition(stepId) {
        const step = this.flowState.steps.find(s => s.id == stepId);
        if (!step) return;
        this.session.currentStepId = stepId;
        let blocks = [...step.blocks];
        if(blocks.length > 0 && blocks[0].type === 'delay') {
            const delayBlock = blocks.shift();
            this._addTyping();
            await new Promise(r => setTimeout(r, (delayBlock.duration || 1) * 1000));
            this._removeTyping();
        }
        this._processBlocks(blocks, 0);
    }

    handlePreviewButtonClick(e) {
        if (e.target.classList.contains('button-btn-preview')) {
            e.preventDefault();
            this._addMessage('user', e.target.textContent);
            const targetStepId = e.target.dataset.targetStepId;
            e.target.closest('.buttons-preview').remove();
            if (targetStepId && targetStepId !== 'null') this.handleTransition(targetStepId);
        }
    }

    _findKb(text, block) {
        const lowerText = text.toLowerCase().trim();
        let kbToSearch = this.flowState.knowledgeBase;
        if (block && block.keywordSelectionType === 'group' && block.selectedGroupId) {
            const group = this.flowState.keywordGroups.find(g => g.id == block.selectedGroupId);
            if (group) kbToSearch = this.flowState.knowledgeBase.filter(item => group.keywordIds.includes(item.id));
        } else if (block && block.keywordSelectionType === 'specific' && Array.isArray(block.selectedKeywords) && block.selectedKeywords.length > 0) {
             kbToSearch = this.flowState.knowledgeBase.filter(item => block.selectedKeywords.includes(item.id));
        }
        for (const item of kbToSearch) {
            const keywords = item.keywords.split(',').map(k => k.trim().toLowerCase());
            if (keywords.some(k => k && lowerText.includes(k))) return item;
        }
        return null;
    }

    async handleSend() {
        if(this.dom.userInput.value.trim() === '' || this.dom.userInput.disabled) return;
        const text = this.dom.userInput.value;
        this._addMessage('user', text);
        this.dom.userInput.value = '';
        this.dom.userInput.disabled = true;

        if (this.session.waitingForInput) {
            const waitSession = this.session.waitingForInput;
            const block = waitSession.block;
            if (waitSession.timeoutId) clearTimeout(waitSession.timeoutId);
            if (waitSession.validationType) {
                if (waitSession.validationState === 'awaiting_initial') {
                    let isValid = true, errorMsg = '';
                    if (waitSession.validationType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) { isValid = false; errorMsg = 'Formato de email no válido.'; }
                    if (waitSession.validationType === 'phone') {
                        try {
                            const phoneRegex = new RegExp(block.phoneValidationRegex || '^\\+?\\d{7,15}$');
                            if(!phoneRegex.test(text)) { isValid = false; errorMsg = 'Formato de teléfono no válido.'; }
                        } catch (e) { isValid = false; errorMsg = 'Error en validación.'; }
                    }
                    if (!isValid) { this._addMessage('bot', errorMsg); this.dom.userInput.disabled = false; return; }
                    waitSession.initialValue = text;
                    waitSession.validationState = 'awaiting_confirmation';
                    let confirmMessage = `Gracias. Para confirmar, escríbelo de nuevo.`;
                    if (waitSession.validationType === 'name' && block.nameConfirmMessage) confirmMessage = block.nameConfirmMessage;
                    if (waitSession.validationType === 'email' && block.emailConfirmMessage) confirmMessage = block.emailConfirmMessage;
                    if (waitSession.validationType === 'phone' && block.phoneConfirmMessage) confirmMessage = block.phoneConfirmMessage;
                    this._addMessage('bot', this._replaceVars(confirmMessage));
                    this.dom.userInput.disabled = false;
                } else if (waitSession.validationState === 'awaiting_confirmation') {
                    if (text === waitSession.initialValue) {
                        if (waitSession.variableName) this.session.variables[waitSession.variableName] = waitSession.initialValue;
                        this.session.waitingForInput = null;
                        let successMessage = '¡Dato Confirmado!';
                        if (waitSession.validationType === 'name' && block.nameSuccessMessage) successMessage = block.nameSuccessMessage;
                        if (waitSession.validationType === 'email' && block.emailSuccessMessage) successMessage = block.emailSuccessMessage;
                        if (waitSession.validationType === 'phone' && block.phoneSuccessMessage) successMessage = block.phoneSuccessMessage;
                        this._addMessage('bot', this._replaceVars(successMessage));
                        if (block.nextStepId) setTimeout(() => this.handleTransition(block.nextStepId), 500);
                    } else {
                        waitSession.attempts++;
                        if (waitSession.attempts < 3) {
                            this._addMessage('bot', `No coincide. Te quedan ${3 - waitSession.attempts} intentos.`);
                            waitSession.validationState = 'awaiting_initial';
                            this.dom.userInput.disabled = false;
                        } else {
                            this._addMessage('bot', 'Intentos superados. Reiniciando...');
                            setTimeout(() => this.startSession(), 2000);
                        }
                    }
                }
            } else {
                if (waitSession.variableName) this.session.variables[waitSession.variableName] = text;
                this.session.waitingForInput = null;
                if (waitSession.block.nextStepId) this.handleTransition(waitSession.block.nextStepId);
            }
        } else if (this.session.waitingForKeywordMatch) {
            const { block, blockIndex } = this.session.waitingForKeywordMatch;
            const found = this._findKb(text, block);
            if (found) {
                this._addMessage('bot', found.response);
                if (block.matchEnabled && block.matchStepId) {
                    this.session.waitingForKeywordMatch = null;
                    this.handleTransition(block.matchStepId);
                } else { this.dom.userInput.disabled = false; }
            } else {
                this.session.waitingForKeywordMatch = null;
                const currentStep = this.flowState.steps.find(s => s.id === this.session.currentStepId);
                if (currentStep && currentStep.blocks.length > blockIndex + 1) {
                    this._processBlocks(currentStep.blocks, blockIndex + 1);
                } else {
                    const firstWildcard = this.flowState.steps.find(s => s.type === 'wildcard');
                    if (firstWildcard) this.handleTransition(firstWildcard.id);
                }
            }
        } else {
            const firstWildcard = this.flowState.steps.find(s => s.type === 'wildcard');
            if (firstWildcard) this.handleTransition(firstWildcard.id);
            else this._addMessage('bot', "Lo siento, no he entendido.");
        }
    }
    
    startSession() {
        this.session.variables = {};
        if (this.config.randomChatbotNamesEnabled && this.config.randomChatbotNames) {
            const names = this.config.randomChatbotNames.split(',').map(n => n.trim()).filter(n => n);
            if (names.length > 0) this.session.variables.random_chatbot_name = names[Math.floor(Math.random() * names.length)];
        } else { this.session.variables.random_chatbot_name = this.config.chatbotName; }
        this.dom.chatBody.innerHTML = '';
        this.handleTransition('welcome');
    }
}