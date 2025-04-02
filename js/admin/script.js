import { 
    db, collection, addDoc, serverTimestamp, writeBatch, doc 
} from '../db/firebase-config.js';

// Configuration Cloudinary
const CLOUDINARY = {
    cloudName: 'dvfgozcwy',
    uploadPreset: 'images-products',
    apiUrl: `https://api.cloudinary.com/v1_1/dvfgozcwy/image/upload`,
    allowedParams: ['folder', 'tags'] // Paramètres autorisés en unsigned
};

// Constantes
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Cache simplifié avec sessionStorage
const cache = {
    set: (key, data) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn("Erreur sessionStorage:", e);
        }
    },
    get: (key) => {
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch {
            return null;
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const form = document.getElementById('productForm');
    const submitBtn = document.getElementById('submitBtn');
    const imagePreview = document.getElementById('imagePreview');
    const imageInput = document.getElementById('productImages');
    let selectedFiles = [];

    // Gestion de la sélection d'images
    imageInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        if (files.length > MAX_IMAGES) {
            showToast(`Maximum ${MAX_IMAGES} images autorisées`, 'warning');
            e.target.value = '';
            return;
        }

        imagePreview.innerHTML = '';
        selectedFiles = [];

        files.forEach(file => {
            if (!validateFile(file)) return;
            selectedFiles.push(file);
            previewImage(file);
        });

        updateFileInput();
    });

    // Fonctions utilitaires
    function validateFile(file) {
        if (!ALLOWED_TYPES.includes(file.type)) {
            showToast(`Format non supporté: ${file.name.split('.')[1]}`, 'error');
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            showToast(`Fichier trop lourd (${(file.size/1024/1024).toFixed(1)}MB)`, 'error');
            return false;
        }
        return true;
    }

    function previewImage(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const container = document.createElement('div');
            container.className = 'image-preview';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Prévisualisation';
            img.loading = 'lazy';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.onclick = (event) => {
                event.stopPropagation();
                removeImage(file);
            };
            
            container.appendChild(img);
            container.appendChild(removeBtn);
            imagePreview.appendChild(container);
        };
        reader.readAsDataURL(file);
    }

    function removeImage(fileToRemove) {
        selectedFiles = selectedFiles.filter(file => file !== fileToRemove);
        updateFileInput();
        imagePreview.innerHTML = '';
        selectedFiles.forEach(previewImage);
    }

    function updateFileInput() {
        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(file => dataTransfer.items.add(file));
        imageInput.files = dataTransfer.files;
    }

    // Upload optimisé vers Cloudinary
    async function uploadToCloudinary(file, index, total) {
        updateUploadStatus(`Upload ${index + 1}/${total}`, (index/total) * 100);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY.uploadPreset);
        formData.append('folder', 'products');
        
        try {
            const response = await fetch(CLOUDINARY.apiUrl, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Upload failed');
            }
            
            const data = await response.json();
            return {
                url: data.secure_url.replace('/upload/', '/upload/q_auto,f_auto/'),
                public_id: data.public_id,
                dimensions: `${data.width}x${data.height}`
            };
        } catch (error) {
            console.error('Erreur upload:', error);
            throw error;
        }
    }

    // Gestion UI
    function updateUploadStatus(message, percent = 0) {
        let statusEl = document.getElementById('uploadStatus');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'uploadStatus';
            statusEl.className = 'mt-3';
            form.insertBefore(statusEl, submitBtn.parentNode);
        }
        
        statusEl.innerHTML = `
            <div class="progress mb-2">
                <div class="progress-bar progress-bar-striped" 
                     style="width: ${percent}%"></div>
            </div>
            <small class="text-muted">${message}</small>
        `;
    }

    function showToast(message, type = 'success') {
        const toastEl = document.createElement('div');
        toastEl.className = `toast show position-fixed bottom-0 end-0 m-3`;
        toastEl.innerHTML = `
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">${type === 'error' ? 'Erreur' : 'Succès'}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        `;
        
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 5000);
    }

    // Validation des données
    function validateProduct(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push("Le nom doit contenir au moins 2 caractères");
        }
        
        if (isNaN(data.price)) {
            errors.push("Prix invalide");
        }
        
        if (selectedFiles.length === 0) {
            errors.push("Ajoutez au moins une image");
        }
        
        return errors;
    }

    // Soumission du formulaire
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Validation initiale
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // État de chargement
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enregistrement...';
        submitBtn.disabled = true;

        try {
            // Préparation données
            const productData = {
                name: document.getElementById('productName').value.trim(),
                category: document.getElementById('productCategory').value,
                price: parseFloat(document.getElementById('productPrice').value),
                stock: parseInt(document.getElementById('productStock').value),
                description: document.getElementById('productDescription').value.trim(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                images: [],
                searchKeywords: [
                    document.getElementById('productName').value.trim().toLowerCase(),
                    document.getElementById('productCategory').value
                ]
            };

            // Validation avancée
            const errors = validateProduct(productData);
            if (errors.length > 0) {
                throw new Error(errors.join(", "));
            }

            // Upload des images
            productData.images = await Promise.all(
                selectedFiles.map((file, index) => 
                    uploadToCloudinary(file, index, selectedFiles.length)
            ));

            // Enregistrement Firestore
            const batch = writeBatch(db);
            const productRef = doc(collection(db, "products"));
            batch.set(productRef, productData);
            await batch.commit();

            // Cache local
            cache.set(`product_${productRef.id}`, {
                ...productData,
                id: productRef.id,
                cachedAt: new Date().toISOString()
            });

            // Affichage résultat
            document.getElementById('productDataPreview').textContent = 
                JSON.stringify({ id: productRef.id, ...productData }, null, 2);
            
            new bootstrap.Modal(document.getElementById('confirmationModal')).show();
            form.reset();
            imagePreview.innerHTML = '';
            selectedFiles = [];

        } catch (error) {
            console.error("Erreur:", error);
            showToast(error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            document.getElementById('uploadStatus')?.remove();
        }
    });
});