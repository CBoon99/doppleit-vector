// Export Manager for Vector Graphics
class ExportManager {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.supportedFormats = {
            svg: {
                mime: 'image/svg+xml',
                extension: 'svg',
                options: {
                    precision: 2,
                    includeMetadata: true,
                    optimizePaths: true,
                    embedImages: true
                }
            },
            png: {
                mime: 'image/png',
                extension: 'png',
                options: {
                    scale: 1,
                    backgroundColor: 'transparent',
                    dpi: 72
                }
            },
            pdf: {
                mime: 'application/pdf',
                extension: 'pdf',
                options: {
                    pageSize: 'A4',
                    orientation: 'portrait',
                    margin: 0,
                    includeMetadata: true
                }
            }
        };
    }

    // Export Methods
    async exportToSVG(options = {}) {
        const settings = { ...this.supportedFormats.svg.options, ...options };
        const objects = this.stateManager.getObjects();
        const bounds = this.calculateBounds(objects);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', bounds.width);
        svg.setAttribute('height', bounds.height);
        svg.setAttribute('viewBox', `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);

        // Add metadata if requested
        if (settings.includeMetadata) {
            const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
            metadata.innerHTML = this.generateMetadata();
            svg.appendChild(metadata);
        }

        // Add objects
        objects.forEach(obj => {
            const element = this.createSVGElement(obj, settings);
            if (element) {
                svg.appendChild(element);
            }
        });

        // Optimize paths if requested
        if (settings.optimizePaths) {
            this.optimizeSVGPaths(svg);
        }

        return new XMLSerializer().serializeToString(svg);
    }

    async exportToPNG(options = {}) {
        const settings = { ...this.supportedFormats.png.options, ...options };
        const objects = this.stateManager.getObjects();
        const bounds = this.calculateBounds(objects);

        // Create canvas with proper scale
        const canvas = document.createElement('canvas');
        const scale = settings.scale;
        canvas.width = bounds.width * scale;
        canvas.height = bounds.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.translate(-bounds.x, -bounds.y);

        // Set background if specified
        if (settings.backgroundColor !== 'transparent') {
            ctx.fillStyle = settings.backgroundColor;
            ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        }

        // Render objects
        objects.forEach(obj => {
            this.renderObject(ctx, obj);
        });

        return canvas.toDataURL(settings.mime, 1.0);
    }

    async exportToPDF(options = {}) {
        const settings = { ...this.supportedFormats.pdf.options, ...options };
        const objects = this.stateManager.getObjects();
        const bounds = this.calculateBounds(objects);

        // Create PDF document
        const pdf = new jsPDF({
            orientation: settings.orientation,
            unit: 'pt',
            format: settings.pageSize
        });

        // Calculate scaling to fit page
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const scale = Math.min(
            (pageWidth - settings.margin * 2) / bounds.width,
            (pageHeight - settings.margin * 2) / bounds.height
        );

        // Add metadata if requested
        if (settings.includeMetadata) {
            const metadata = this.generateMetadata();
            Object.entries(metadata).forEach(([key, value]) => {
                pdf.setProperties({ [key]: value });
            });
        }

        // Convert objects to PDF commands
        objects.forEach(obj => {
            this.addObjectToPDF(pdf, obj, scale, settings.margin);
        });

        return pdf;
    }

    // Helper Methods
    createSVGElement(obj, settings) {
        let element;

        switch (obj.type) {
            case 'rect':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                element.setAttribute('x', obj.x.toFixed(settings.precision));
                element.setAttribute('y', obj.y.toFixed(settings.precision));
                element.setAttribute('width', obj.width.toFixed(settings.precision));
                element.setAttribute('height', obj.height.toFixed(settings.precision));
                break;

            case 'circle':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                element.setAttribute('cx', (obj.x + obj.width / 2).toFixed(settings.precision));
                element.setAttribute('cy', (obj.y + obj.height / 2).toFixed(settings.precision));
                element.setAttribute('r', (Math.min(obj.width, obj.height) / 2).toFixed(settings.precision));
                break;

            case 'path':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                element.setAttribute('d', this.optimizePathData(obj.d, settings.precision));
                break;

            case 'text':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                element.setAttribute('x', obj.x.toFixed(settings.precision));
                element.setAttribute('y', obj.y.toFixed(settings.precision));
                element.textContent = obj.content;
                break;

            case 'image':
                if (settings.embedImages) {
                    element = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    element.setAttribute('x', obj.x.toFixed(settings.precision));
                    element.setAttribute('y', obj.y.toFixed(settings.precision));
                    element.setAttribute('width', obj.width.toFixed(settings.precision));
                    element.setAttribute('height', obj.height.toFixed(settings.precision));
                    element.setAttribute('href', obj.src);
                }
                break;
        }

        if (element) {
            this.applyStylesToSVGElement(element, obj);
        }

        return element;
    }

    applyStylesToSVGElement(element, obj) {
        if (obj.fill) {
            element.setAttribute('fill', obj.fill);
        }
        if (obj.stroke) {
            element.setAttribute('stroke', obj.stroke);
            element.setAttribute('stroke-width', obj.strokeWidth || 1);
        }
        if (obj.opacity !== undefined) {
            element.setAttribute('opacity', obj.opacity);
        }
        if (obj.transform) {
            const transform = [];
            if (obj.transform.rotation) {
                transform.push(`rotate(${obj.transform.rotation})`);
            }
            if (obj.transform.scale) {
                transform.push(`scale(${obj.transform.scale.x}, ${obj.transform.scale.y})`);
            }
            if (obj.transform.skew) {
                transform.push(`skew(${obj.transform.skew.x}, ${obj.transform.skew.y})`);
            }
            if (transform.length > 0) {
                element.setAttribute('transform', transform.join(' '));
            }
        }
    }

    renderObject(context, obj) {
        context.save();

        // Apply styles
        if (obj.fill) {
            context.fillStyle = obj.fill;
        }
        if (obj.stroke) {
            context.strokeStyle = obj.stroke;
            context.lineWidth = obj.strokeWidth || 1;
        }
        if (obj.opacity !== undefined) {
            context.globalAlpha = obj.opacity;
        }

        // Apply transformations
        if (obj.transform) {
            context.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
            if (obj.transform.rotation) {
                context.rotate(obj.transform.rotation);
            }
            if (obj.transform.scale) {
                context.scale(obj.transform.scale.x, obj.transform.scale.y);
            }
            if (obj.transform.skew) {
                context.transform(1, obj.transform.skew.y, obj.transform.skew.x, 1, 0, 0);
            }
            context.translate(-(obj.x + obj.width / 2), -(obj.y + obj.height / 2));
        }

        // Draw object
        switch (obj.type) {
            case 'rect':
                context.fillRect(obj.x, obj.y, obj.width, obj.height);
                break;

            case 'circle':
                context.beginPath();
                context.arc(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    Math.min(obj.width, obj.height) / 2,
                    0,
                    Math.PI * 2
                );
                context.fill();
                break;

            case 'path':
                context.fill(new Path2D(obj.d));
                break;

            case 'text':
                context.font = `${obj.fontSize}px ${obj.fontFamily}`;
                context.textAlign = obj.textAlign || 'left';
                context.fillText(obj.content, obj.x, obj.y);
                break;

            case 'image':
                const img = new Image();
                img.src = obj.src;
                context.drawImage(img, obj.x, obj.y, obj.width, obj.height);
                break;
        }

        context.restore();
    }

    addObjectToPDF(pdf, obj, scale, margin) {
        pdf.saveGraphicsState();

        // Apply styles
        if (obj.fill) {
            pdf.setFillColor(this.parseColor(obj.fill));
        }
        if (obj.stroke) {
            pdf.setDrawColor(this.parseColor(obj.stroke));
            pdf.setLineWidth(obj.strokeWidth || 1);
        }
        if (obj.opacity !== undefined) {
            pdf.setAlpha(obj.opacity);
        }

        // Apply transformations
        if (obj.transform) {
            pdf.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
            if (obj.transform.rotation) {
                pdf.rotate(obj.transform.rotation);
            }
            if (obj.transform.scale) {
                pdf.scale(obj.transform.scale.x, obj.transform.scale.y);
            }
            if (obj.transform.skew) {
                pdf.transform(1, obj.transform.skew.y, obj.transform.skew.x, 1, 0, 0);
            }
            pdf.translate(-(obj.x + obj.width / 2), -(obj.y + obj.height / 2));
        }

        // Draw object
        switch (obj.type) {
            case 'rect':
                pdf.rect(obj.x, obj.y, obj.width, obj.height, 'F');
                break;

            case 'circle':
                pdf.circle(obj.x + obj.width / 2, obj.y + obj.height / 2, 
                          Math.min(obj.width, obj.height) / 2, 'F');
                break;

            case 'path':
                // Convert SVG path to PDF path
                const path = this.convertPathToPDF(obj.d);
                pdf.path(path, 'F');
                break;

            case 'text':
                pdf.setFont(obj.fontFamily);
                pdf.setFontSize(obj.fontSize);
                pdf.text(obj.content, obj.x, obj.y);
                break;

            case 'image':
                pdf.addImage(obj.src, 'PNG', obj.x, obj.y, obj.width, obj.height);
                break;
        }

        pdf.restoreGraphicsState();
    }

    // Utility Methods
    calculateBounds(objects) {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        objects.forEach(obj => {
            minX = Math.min(minX, obj.x);
            minY = Math.min(minY, obj.y);
            maxX = Math.max(maxX, obj.x + obj.width);
            maxY = Math.max(maxY, obj.y + obj.height);
        });

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    generateMetadata() {
        return {
            title: 'Vector Graphics Export',
            author: 'Vector Editor',
            creator: 'Vector Editor',
            creationDate: new Date().toISOString(),
            modificationDate: new Date().toISOString()
        };
    }

    optimizeSVGPaths(svg) {
        const paths = svg.querySelectorAll('path');
        paths.forEach(path => {
            const d = path.getAttribute('d');
            path.setAttribute('d', this.optimizePathData(d));
        });
    }

    optimizePathData(d, precision = 2) {
        // Implement path optimization logic here
        // This is a placeholder for actual path optimization
        return d;
    }

    parseColor(color) {
        // Convert color string to RGB array
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        const [r, g, b] = ctx.fillStyle.match(/\d+/g).map(Number);
        return [r, g, b];
    }

    convertPathToPDF(svgPath) {
        // Convert SVG path data to PDF path commands
        // This is a placeholder for actual path conversion
        return svgPath;
    }
}

export default ExportManager; 