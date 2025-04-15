
// Cindara Vector Engine v1.0 – Modular Core
// Restored by Echo from Carl’s original LuxLabs architecture

const Cindara = {
    Core: {
        reset: () => {
            ['svgOutput', 'layerList'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = '';
            });
            Object.assign(Cindara._state, {
                layers: [],
                scale: 1,
                translateX: 0,
                translateY: 0
            });
            const exp = document.getElementById('exportBtn');
            const rst = document.getElementById('resetZoomPan');
            if (exp) exp.disabled = true;
            if (rst) rst.disabled = true;
            console.log('[Cindara.Core] Reset complete.');
        }
    },

    
    Image: {
        load: (file) => {
            if (!file) return;
            const fileName = file.name || 'unnamed_upload';
            const fakePath = `uploads/${fileName}`;

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    Object.assign(Cindara._state, { image: img });
                    const canvas = document.getElementById('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    document.getElementById('svgContainer').style.width = img.width + 'px';
                    document.getElementById('svgContainer').style.height = img.height + 'px';
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    document.getElementById('vectorizeBtn').disabled = false;
                    console.log(`[Cindara.Image] Image uploaded and loaded: ${fakePath}`);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
                    const canvas = document.getElementById('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    document.getElementById('svgContainer').style.width = img.width + 'px';
                    document.getElementById('svgContainer').style.height = img.height + 'px';
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    document.getElementById('vectorizeBtn').disabled = false;
                    console.log('[Cindara.Image] Image loaded.');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    },

    Trace: {
        run: () => {
            if (!Cindara._state.image) return;
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const { data: pixels, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
            Cindara._state.layers = [];
            const edges = Cindara.Trace._detectEdges(pixels, width, height);
            const visited = new Set();

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x;
                    if (edges[idx] && !visited.has(idx)) {
                        const path = Cindara.Trace._followEdge(x, y, edges, width, height, visited);
                        if (path.length > 2) {
                            Cindara._state.layers.push({
                                id: `layer-${Cindara._state.layers.length}`,
                                path: Cindara.Trace._toSVGPath(path),
                                fill: '#000000'
                            });
                        }
                    }
                }
            }

            Cindara.Visual.renderLayers();
            document.getElementById('exportBtn').disabled = false;
            document.getElementById('resetZoomPan').disabled = false;
            console.log(`[Cindara.Trace] Created ${Cindara._state.layers.length} layers.`);
        },

        _detectEdges: (pixels, width, height) => {
            const edges = new Uint8Array(width * height);
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    const idx = (y * width + x) * 4;
                    const gray = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
                    const right = ((y * width + x + 1) * 4);
                    const down = (((y + 1) * width + x) * 4);
                    const contrast = Math.abs(gray - (pixels[right] + pixels[right + 1] + pixels[right + 2]) / 3) +
                                     Math.abs(gray - (pixels[down] + pixels[down + 1] + pixels[down + 2]) / 3);
                    edges[y * width + x] = contrast > 50 ? 1 : 0;
                }
            }
            return edges;
        },

        _followEdge: (x, y, edges, width, height, visited, path = [], dir = 0) => {
            const idx = y * width + x;
            if (visited.has(idx) || x < 0 || x >= width || y < 0 || y >= height || !edges[idx]) return path;
            visited.add(idx);
            path.push([x, y]);

            const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
            for (let i = 0; i < 8; i++) {
                const nextDir = (dir + i) % 8;
                const [dx, dy] = dirs[nextDir];
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && edges[ny * width + nx] && !visited.has(ny * width + nx)) {
                    return Cindara.Trace._followEdge(nx, ny, edges, width, height, visited, path, nextDir);
                }
            }
            return path;
        },

        _toSVGPath: (points) => {
            if (points.length < 2) return '';
            return `M${points[0][0]},${points[0][1]}` +
                   points.slice(1).reduce((d, [x, y]) => d + ` L${x},${y}`, '') + ' Z';
        }
    },

    Visual: {
        renderLayers: () => {
            const layerList = document.getElementById('layerList');
            layerList.innerHTML = '';
            Cindara._state.layers.forEach((layer, i) => {
                const div = document.createElement('div');
                div.className = 'layer-item';
                div.innerHTML = `Layer ${i + 1}: <input type="color" value="${layer.fill}" onchange="Cindara.Visual.setColor(${i}, this.value)">`;
                layerList.appendChild(div);
            });
            Cindara.Visual.draw();
        },

        setColor: (index, color) => {
            if (index < 0 || index >= Cindara._state.layers.length) return;
            Cindara._state.layers[index].fill = color;
            Cindara.Visual.draw();
        },

        draw: () => {
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('width', Cindara._state.image?.width || 500);
            svg.setAttribute('height', Cindara._state.image?.height || 500);
            Cindara._state.layers.forEach(layer => {
                const path = document.createElementNS(svgNS, 'path');
                path.setAttribute('d', layer.path);
                path.setAttribute('fill', layer.fill);
                svg.appendChild(path);
            });
            const output = document.getElementById('svgOutput');
            output.innerHTML = '';
            output.appendChild(svg);
        }
    },

    
    Export: {
        saveSVG: () => {
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `output/cindara_vector_${ts}.svg`;

            svg.setAttribute('xmlns', svgNS);
            svg.setAttribute('width', Cindara._state.image?.width || 500);
            svg.setAttribute('height', Cindara._state.image?.height || 500);
            svg.setAttribute('viewBox', `0 0 ${Cindara._state.image?.width || 500} ${Cindara._state.image?.height || 500}`);

            Cindara._state.layers.forEach(layer => {
                const path = document.createElementNS(svgNS, 'path');
                path.setAttribute('d', layer.path);
                path.setAttribute('fill', layer.fill);
                svg.appendChild(path);
            });

            const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
            console.log(`[Cindara.Export] SVG saved as ${filename}`);
        }
    } ${Cindara._state.image?.height || 500}`);
            Cindara._state.layers.forEach(layer => {
                const path = document.createElementNS(svgNS, 'path');
                path.setAttribute('d', layer.path);
                path.setAttribute('fill', layer.fill);
                svg.appendChild(path);
            });
            const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'cindara_vector.svg';
            a.click();
            URL.revokeObjectURL(a.href);
            console.log('[Cindara.Export] SVG saved.');
        }
    },

    _state: {
        image: null,
        layers: [],
        scale: 1,
        translateX: 0,
        translateY: 0
    }
};
