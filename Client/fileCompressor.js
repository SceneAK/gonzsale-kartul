export default async function compress(file, MAX_WIDTH = 1080, quality = 0.7)
{
    return new Promise( resolve => {

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const SCALING = Math.min(MAX_WIDTH / img.width, 1);
                let scaledWidth = img.width * SCALING;
                let scaledHeight = img.height * SCALING;
        
                const canvas = document.createElement('canvas');
                canvas.width = scaledWidth;
                canvas.height = scaledHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        
                canvas.toBlob(blob=>resolve(blob), 'image/jpeg', quality);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } )
}
