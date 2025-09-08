// Simple Modal System for Bootstrap
class SimpleModal {
    static create(id, title, content, buttons = []) {
        return this.createWithBorder(id, title, content, buttons, 'primary');
    }
    
    static createWithBorder(id, title, content, buttons = [], borderColor = 'primary') {
        // Remove existing modal
        const existing = document.getElementById(id);
        if (existing) existing.remove();
        
        // Create backdrop using Bootstrap modal backdrop
        const backdrop = document.createElement('div');
        backdrop.id = `${id}-backdrop`;
        backdrop.className = 'modal-backdrop fade';
        backdrop.style.display = 'none';
        
        // Create modal using Bootstrap modal structure
        const modalContainer = document.createElement('div');
        modalContainer.id = id;
        modalContainer.className = 'modal fade';
        modalContainer.setAttribute('tabindex', '-1');
        modalContainer.style.display = 'none';
        modalContainer.style.paddingRight = '0px'; // Prevent Bootstrap scroll compensation
        
        modalContainer.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header border-${borderColor}">
                        <h4 class="modal-title text-${borderColor}">${title}</h4>
                        <button type="button" class="btn-close" onclick="SimpleModal.close('${id}')"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${buttons.length > 0 ? `
                    <div class="modal-footer">
                        ${buttons.map(btn => `<button type="button" class="btn ${btn.class}" onclick="${btn.onclick}">${btn.text}</button>`).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(backdrop);
        document.body.appendChild(modalContainer);
        
        return { backdrop, modal: modalContainer };
    }
    
    static show(id) {
        const backdrop = document.getElementById(`${id}-backdrop`);
        const modalContainer = document.getElementById(id);
        
        if (backdrop && modalContainer) {
            // Prevent body scrolling
            document.body.classList.add('modal-open');
            
            // Show backdrop and modal using Bootstrap classes
            backdrop.style.display = 'block';
            modalContainer.style.display = 'flex'; // Use flex to center
            modalContainer.style.alignItems = 'center'; // Vertical center
            modalContainer.style.justifyContent = 'center'; // Horizontal center
            
            // Add Bootstrap show classes for animation
            setTimeout(() => {
                backdrop.classList.add('show');
                modalContainer.classList.add('show');
            }, 10);
            
            // Close on backdrop click (only if clicking outside modal-content)
            modalContainer.onclick = (e) => {
                if (e.target === modalContainer) {
                    SimpleModal.close(id);
                }
            };
            
            // Close on Escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    SimpleModal.close(id);
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        }
    }
    
    static close(id) {
        const backdrop = document.getElementById(`${id}-backdrop`);
        const modalContainer = document.getElementById(id);
        
        if (backdrop && modalContainer) {
            // Remove Bootstrap show classes for animation
            backdrop.classList.remove('show');
            modalContainer.classList.remove('show');
            
            // Remove modal-open class to restore body scroll
            document.body.classList.remove('modal-open');
            
            // Remove elements after animation completes
            setTimeout(() => {
                backdrop.remove();
                modalContainer.remove();
            }, 150);
        }
    }
}

// Make it globally available for onclick handlers
window.SimpleModal = SimpleModal;

export { SimpleModal };
