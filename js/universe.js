// 3D宇宙背景渲染
class UniverseBackground {
    constructor() {
        this.canvas = document.getElementById('universe-canvas');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        
        this.stars = [];
        this.nebulae = [];
        this.time = 0;
        
        this.init();
    }
    
    init() {
        // 设置渲染器
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000011, 1);
        
        // 设置相机
        this.camera.position.z = 5;
        
        // 创建星空
        this.createStars();
        this.createNebulae();
        this.createGalaxy();
        
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // 添加点光源
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
        
        // 开始动画
        this.animate();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 5000;
        const positions = new Float32Array(starsCount * 3);
        const colors = new Float32Array(starsCount * 3);
        
        for (let i = 0; i < starsCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.2 + 0.5, 0.6, 0.7 + Math.random() * 0.3);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
        this.stars.push(stars);
    }
    
    createNebulae() {
        const nebulaCount = 4;
        const colors = [0x4466aa, 0x664488, 0x448866, 0x884466];
        
        for (let i = 0; i < nebulaCount; i++) {
            const nebulaGeometry = new THREE.SphereGeometry(Math.random() * 2.5 + 1.5, 32, 32);
            const nebulaMaterial = new THREE.MeshBasicMaterial({
                color: colors[i],
                transparent: true,
                opacity: 0.08,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            
            const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
            nebula.position.set(
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25
            );
            
            this.scene.add(nebula);
            this.nebulae.push(nebula);
        }
    }
    
    createGalaxy() {
        const galaxyGeometry = new THREE.BufferGeometry();
        const galaxyCount = 4000;
        const positions = new Float32Array(galaxyCount * 3);
        
        for (let i = 0; i < galaxyCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 12 + 1;
            const spinAngle = radius * 0.6;
            const branchAngle = (i % 3) * (Math.PI * 2 / 3);
            
            const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.8;
            const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
            const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.8;
            
            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        }
        
        galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const galaxyMaterial = new THREE.PointsMaterial({
            color: 0x8899ff,
            size: 0.04,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
        galaxy.rotation.x = Math.PI * 0.3;
        galaxy.rotation.z = Math.PI * 0.15;
        this.scene.add(galaxy);
        this.galaxy = galaxy;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.002;
        
        this.stars.forEach(star => {
            star.rotation.y += 0.0003;
            star.rotation.x += 0.0001;
            star.rotation.z += 0.00005;
        });
        
        this.nebulae.forEach((nebula, i) => {
            nebula.rotation.y += 0.0008 * (i + 1);
            nebula.rotation.x += 0.0004 * (i + 1);
        });
        
        if (this.galaxy) {
            this.galaxy.rotation.y += 0.0005;
            this.galaxy.rotation.x += 0.0001;
        }
        
        this.camera.position.x = Math.sin(this.time * 0.4) * 0.5;
        this.camera.position.y = Math.cos(this.time * 0.3) * 0.3;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// 初始化宇宙背景
document.addEventListener('DOMContentLoaded', () => {
    new UniverseBackground();
});