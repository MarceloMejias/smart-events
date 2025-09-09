// Community Comments Component
class CommunityComments {
    constructor() {
        this.comments = [];
        this.form = null;
        this.container = null;
        this.storageKey = 'smart-events-comments';
        // Fixed current date for consistent time calculations
        this.currentDate = new Date('2025-09-08T12:00:00');
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupComponent());
        } else {
            this.setupComponent();
        }
    }

    async setupComponent() {
        this.form = document.getElementById('comment-form');
        this.container = document.getElementById('comments-container');
        
        if (!this.form || !this.container) {
            console.warn('CommunityComments: Required elements not found');
            return;
        }

        this.setupEventListeners();
        this.loadComments();
        this.updateCommentsCount();
        this.updateStorageStatus();
    }



    loadComments() {
        try {
            // Load from localStorage
            let localComments = this.loadFromStorage();
            
            // Use the comments as they are (empty array if none exist)
            this.comments = localComments;
            this.renderComments();
            
        } catch (error) {
            console.error('Error loading comments:', error);
            // Fallback to empty comments
            this.comments = [];
            this.renderComments();
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                return data.map(comment => ({
                    ...comment,
                    timestamp: new Date(comment.timestamp)
                }));
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        return [];
    }

    saveToStorage(comments = this.comments) {
        try {
            const dataToStore = comments.map(comment => ({
                ...comment,
                timestamp: comment.timestamp.toISOString()
            }));
            localStorage.setItem(this.storageKey, JSON.stringify(dataToStore));
            console.log('💾 Comentarios guardados en localStorage');
            
            // Also show in console what would be saved to JSON
            console.log('📄 Datos que se guardarían en JSON:', {
                totalComments: comments.length,
                lastUpdate: this.currentDate.toISOString(),
                comments: dataToStore.slice(0, 3) // Show first 3 for preview
            });
            
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

        // Export comments to JSON (for backup purposes)
    exportCommentsToJson() {
        const dataToExport = {
            comments: this.comments.map(comment => ({
                id: comment.id,
                name: comment.name,
                message: comment.message,
                timestamp: comment.timestamp.toISOString(),
                isNew: false
            })),
            exportDate: this.currentDate.toISOString(),
            totalComments: this.comments.length,
            note: "Backup de comentarios desde localStorage"
        };
        
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], 
                             { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comments-backup-${this.currentDate.toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📥 Backup de comentarios exportado desde localStorage');
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Character counter
        const messageTextarea = document.getElementById('comment-message');
        const charCount = document.getElementById('char-count');
        
        messageTextarea.addEventListener('input', () => {
            const count = messageTextarea.value.length;
            charCount.textContent = count;
            charCount.className = count > 450 ? 'text-warning' : count === 500 ? 'text-danger' : '';
        });

        // Clear form button
        const clearBtn = document.getElementById('clear-form');
        clearBtn.addEventListener('click', () => {
            this.clearForm();
        });

        // Data management buttons
        const exportBtn = document.getElementById('export-comments');
        const clearStorageBtn = document.getElementById('clear-storage');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCommentsToJson();
            });
        }

        if (clearStorageBtn) {
            clearStorageBtn.addEventListener('click', () => {
                this.clearStorage();
            });
        }

        // Fix dropdown positioning issues
        const dropdownToggle = document.querySelector('.btn-group .dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('shown.bs.dropdown', (event) => {
                // Remove any custom positioning - let Bootstrap handle it
                const dropdownMenu = event.target.nextElementSibling;
                if (dropdownMenu) {
                    // Reset to Bootstrap defaults
                    dropdownMenu.style.zIndex = '';
                    dropdownMenu.style.position = '';
                    dropdownMenu.style.top = '';
                    dropdownMenu.style.left = '';
                }
            });
        }
    }

    clearStorage() {
        if (confirm('⚠️ ¿Estás seguro de que quieres eliminar todos los comentarios? Esta acción no se puede deshacer.')) {
            localStorage.removeItem(this.storageKey);
            this.comments = [];
            this.renderComments();
            this.updateCommentsCount();
            this.updateStorageStatus();
            
            // Show confirmation
            this.showMessage('🗑️ Todos los comentarios han sido eliminados', 'info');
            
            console.log('🗑️ Almacenamiento de comentarios limpiado');
        }
    }

    showMessage(message, type = 'success') {
        // Create temporary message
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        
        // Add additional info for storage-related messages
        let additionalInfo = '';
        if (type === 'info' && message.includes('localStorage')) {
            additionalInfo = '<br><small><i class="fas fa-info-circle me-1"></i>Los comentarios se guardan en tu navegador. Usa "Exportar" para crear un backup.</small>';
        }
        
        messageDiv.innerHTML = `
            ${message}${additionalInfo}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert after form
        this.form.parentNode.insertBefore(messageDiv, this.form.nextSibling);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    handleFormSubmit() {
        const nameInput = document.getElementById('comment-name');
        const messageInput = document.getElementById('comment-message');

        // Validate form
        if (!this.form.checkValidity()) {
            this.form.classList.add('was-validated');
            return;
        }

        // Create new comment
        const comment = {
            id: Date.now(),
            name: nameInput.value.trim(),
            message: messageInput.value.trim(),
            timestamp: this.currentDate,
            isNew: true
        };

        // Add comment
        this.addComment(comment);
        
        // Clear form
        this.clearForm();
        
        // Show success message
        this.showSuccessMessage();
    }

    addComment(comment) {
        // Add to beginning of array (newest first)
        this.comments.unshift(comment);
        
        // Save to localStorage immediately
        this.saveToStorage();
        
        // Re-render comments
        this.renderComments();
        
        // Update count
        this.updateCommentsCount();
        
        // Update storage status
        this.updateStorageStatus();
        
        console.log('💬 Nuevo comentario agregado y guardado');
    }

    renderComments() {
        if (!this.container) return;

        this.container.innerHTML = this.comments.map(comment => 
            this.createCommentCard(comment)
        ).join('');

        // Add animation to new comments
        const newComments = this.container.querySelectorAll('.comment-card.new-comment');
        newComments.forEach(card => {
            // Remove new-comment class after animation
            setTimeout(() => {
                card.classList.remove('new-comment');
            }, 1000);
        });
    }

    createCommentCard(comment) {
        const timeAgo = this.getTimeAgo(comment.timestamp);
        const formattedDate = this.formatDate(comment.timestamp);
        const animationClass = comment.isNew ? 'new-comment' : '';
        
        return `
            <div class="card bg-secondary text-white mb-3 comment-card ${animationClass}" data-comment-id="${comment.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="d-flex align-items-center">
                            <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style="width: 40px; height: 40px;">
                                <i class="fas fa-user text-white"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 text-primary">${this.escapeHtml(comment.name)}</h6>
                                <small class="text-muted">
                                    <i class="fas fa-clock me-1"></i>
                                    ${timeAgo} • ${formattedDate}
                                </small>
                            </div>
                        </div>
                        ${comment.isNew ? '<span class="badge bg-success">Nuevo</span>' : ''}
                    </div>
                    <p class="card-text mb-0">${this.escapeHtml(comment.message)}</p>
                </div>
            </div>
        `;
    }

    // Delete this old method as we now load from JSON/localStorage
    /*
    loadSampleComments() {
        // This method is now replaced by loadComments()
    }
    */

    clearForm() {
        this.form.reset();
        this.form.classList.remove('was-validated');
        document.getElementById('char-count').textContent = '0';
        document.getElementById('char-count').className = '';
    }

    showSuccessMessage() {
        this.showMessage('🎉 ¡Comentario publicado!', 'success');
    }

    updateCommentsCount() {
        const countElement = document.getElementById('comments-count');
        if (countElement) {
            const count = this.comments.length;
            countElement.textContent = `${count} comentario${count !== 1 ? 's' : ''}`;
        }
    }

    getTimeAgo(timestamp) {
        const now = this.currentDate;
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `hace ${minutes}m`;
        if (hours < 24) return `hace ${hours}h`;
        return `hace ${days}d`;
    }

    formatDate(timestamp) {
        return timestamp.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .new-comment {
        animation: slideInUp 0.5s ease-out;
        border-left: 4px solid var(--bs-primary) !important;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .comment-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .comment-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(style);

export { CommunityComments };
