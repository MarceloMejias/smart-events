// Component Loader Utility
class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
    }

    async loadComponent(elementId, componentPath, callback = null) {
        const targetElement = document.getElementById(elementId);
        
        if (!targetElement) {
            console.error(`Target element with ID '${elementId}' not found`);
            return false;
        }

        try {
            if (window.location.protocol === 'file:') {
                console.warn('Running locally - component loading may not work due to CORS restrictions');
            }

            const response = await fetch(componentPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            targetElement.innerHTML = html;
            
            this.loadedComponents.add(componentPath);
            
            if (callback && typeof callback === 'function') {
                callback(targetElement);
            }
            
            document.dispatchEvent(new CustomEvent('componentLoaded', {
                detail: { elementId, componentPath, element: targetElement }
            }));
            
            return true;
            
        } catch (error) {
            console.error(`Failed to load component '${componentPath}':`, error);
            
            targetElement.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Component could not be loaded. Please refresh the page.
                </div>
            `;
            
            return false;
        }
    }

    async loadMultipleComponents(components) {
        const promises = components.map(({ elementId, componentPath, callback }) => 
            this.loadComponent(elementId, componentPath, callback)
        );
        
        const results = await Promise.allSettled(promises);
        
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Failed to load component ${components[index].componentPath}:`, result.reason);
            }
        });
        
        return results;
    }

    isComponentLoaded(componentPath) {
        return this.loadedComponents.has(componentPath);
    }
}

export { ComponentLoader };
