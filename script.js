class SolarSystem {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("solar-system"),
      antialias: true,
    });
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isPaused = false;
    this.isDarkMode = true;

    this.planetData = [
      { name: "Mercury", size: 0.4, distance: 8, speed: 4.0, color: "gray" },
      { name: "Venus", size: 0.9, distance: 12, speed: 1.6, color: "white" },
      { name: "Earth", size: 1.0, distance: 16, speed: 1.0, color: "blue" },
      { name: "Mars", size: 0.5, distance: 20, speed: 0.5, color: "red" },
      { name: "Jupiter", size: 2.5, distance: 28, speed: 0.08, color: "yellow" },
      { name: "Saturn", size: 2.0, distance: 36, speed: 0.03, color: "gold" },
      { name: "Uranus", size: 1.5, distance: 44, speed: 0.01, color: "green" },
      { name: "Neptune", size: 1.4, distance: 52, speed: 0.006, color: "blue" },
    ];

    this.planets = [];
    this.stars = [];
    this.controls = null;

    this.init();
    this.setupStyling();
    this.createControls();
    this.setupEventListeners();
    this.animate();
    this.backgroundAudio();
  }

  init() {
    // Renderer setup
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Camera position
    this.camera.position.set(0, 30, 60);
    this.camera.lookAt(0, 0, 0);

    // Basic controls (mouse interaction)
    this.setupMouseControls();

    // Create scene
    this.createSun();
    this.createPlanets();
    this.createStars();
    this.createLighting();
  }

  setupStyling() {
    // Body styling
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.background =
      "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)";
    document.body.style.color = "#ffffff";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    // Canvas container
    const canvasContainer = document.getElementById("canvas-container");
    canvasContainer.style.position = "relative";
    canvasContainer.style.width = "100vw";
    canvasContainer.style.height = "100vh";

    // Controls panel
    const controls = document.getElementById("controls");
    controls.style.position = "absolute";
    controls.style.top = "20px";
    controls.style.left = "20px";
    controls.style.background = "rgba(51, 28, 81, 0.41)";
    controls.style.padding = "10px";
    controls.style.borderRadius = "8px";
    controls.style.maxWidth = "310px";
    controls.style.maxHeight = "75vh";
    controls.style.overflowY = "auto";
    controls.style.zIndex = "1000";

    // Title styling
    const title = controls.querySelector("h1");
    title.style.fontSize = "1.4rem";
    title.style.marginBottom = "15px";
    title.style.textAlign = "center";
    title.style.color = "#7c22c1cd";

    // Control group styling
    const controlGroups = controls.querySelectorAll(".control-group");
    controlGroups.forEach((group) => {
      group.style.marginBottom = "15px";
    });

    const labels = controls.querySelectorAll("label");
    labels.forEach((label) => {
      label.style.display = "block";
      label.style.marginBottom = "5px";
      label.style.fontSize = "1.5rem";
      label.style.color = "#cccccc";
    });

    // Main controls styling
    const mainControls = controls.querySelector(".main-controls");
    mainControls.style.textAlign = "center";
    mainControls.style.marginTop = "20px";
    mainControls.style.paddingTop = "15px";
    mainControls.style.borderTop = "1px solid rgba(72, 40, 100, 1)";

    // Info panel
    const infoPanel = document.querySelector(".info-panel");
    infoPanel.style.position = "absolute";
    infoPanel.style.top = "25px";
    infoPanel.style.right = "20px";
    infoPanel.style.background = "rgba(51, 28, 81, 0.41)";
    infoPanel.style.padding = "12px";
    infoPanel.style.borderRadius = "10px";
    infoPanel.style.border = "1px solid rgba(60, 54, 54, 0.1)";
    infoPanel.style.maxWidth = "220px";
    infoPanel.style.fontSize = "1rem";

    const infoPanelTitle = infoPanel.querySelector("h3");
    infoPanelTitle.style.marginBottom = "10px";
    infoPanelTitle.style.marginTop = "-3px";
    infoPanelTitle.style.color = "#d9df25ff";

    const infoPanelPs = infoPanel.querySelectorAll("p");
    infoPanelPs.forEach((p) => {
      p.style.margin = "5px 0";
      p.style.fontSize = "0.8em";
    });

    // Button styling function
    this.styleButton = (button) => {
      button.style.background = "#9d16e049";
      button.style.color = "white";
      button.style.border = "none";
      button.style.padding = "7px 7px";
      button.style.borderRadius = "5px";
      button.style.cursor = "pointer";
      button.style.fontSize = "0.9em";
      button.style.margin = "4px";

      button.addEventListener("mouseenter", () => {
        button.style.background = "#9d16e093";
      });

      button.addEventListener("mouseleave", () => {
        button.style.background = "#9d16e049";
      });

      button.addEventListener("mousedown", () => {
        button.style.background = "#9d16e093";
      });

      button.addEventListener("mouseup", () => {
        button.style.background = "#9d16e049";
      });
    };

    // Apply button styling to existing buttons
    const buttons = controls.querySelectorAll("button");
    buttons.forEach((button) => this.styleButton(button));
  }

  setupMouseControls() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const canvas = this.renderer.domElement;

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y,
        };

        // Rotate camera around the origin
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(this.camera.position);
        spherical.theta -= deltaMove.x * 0.01;
        spherical.phi += deltaMove.y * 0.01;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        this.camera.position.setFromSpherical(spherical);
        this.camera.lookAt(0, 0, 0);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Update mouse position for raycasting
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    canvas.addEventListener("mouseup", () => {
      isDragging = false;
    });

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const scale = e.deltaY > 0 ? 1.1 : 0.9;
      this.camera.position.multiplyScalar(scale);
      this.camera.position.clampLength(20, 200);
    });
  }

  createSun() {
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: "orange",
      emissive: "yellow",
      emissiveIntensity: 0.3,
    });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.sun.name = "Sun";
    this.scene.add(this.sun);
  }

  createPlanets() {
    this.planetData.forEach((data) => {
      const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        shininess: 100,
      });

      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.name = data.name;
      planet.position.x = data.distance;
      planet.castShadow = true;
      planet.receiveShadow = true;

      // Create orbit group
      const orbitGroup = new THREE.Group();
      orbitGroup.add(planet);
      this.scene.add(orbitGroup);

      // Create orbit line
      const orbitGeometry = new THREE.RingGeometry(
        data.distance - 0.1,
        data.distance + 0.1,
        64
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbitRing.rotation.x = -Math.PI / 2;
      this.scene.add(orbitRing);

      this.planets.push({
        mesh: planet,
        orbitGroup: orbitGroup,
        data: data,
        currentSpeed: data.speed,
        angle: Math.random() * Math.PI * 2,
      });
    });
  }

  createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
    });

    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 400;
      const y = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 400;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  createLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    this.scene.add(ambientLight);

    // Point light from the sun
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    this.scene.add(pointLight);
  }

  createControls() {
    const controlsContainer = document.getElementById("planet-controls");

    this.planets.forEach((planet, index) => {
      const controlDiv = document.createElement("div");
      controlDiv.className = "planet-control";

      // Style the control div
      controlDiv.style.display = "flex";
      controlDiv.style.alignItems = "center";
      controlDiv.style.marginBottom = "10px";

      const nameSpan = document.createElement("span");
      nameSpan.className = "planet-name";
      nameSpan.textContent = planet.data.name;
      nameSpan.style.width = "80px";
      nameSpan.style.fontSize = "0.8em";
      nameSpan.style.color = "#ffffff";

      const slider = document.createElement("input");
      slider.type = "range";
      slider.className = "speed-slider";
      slider.min = "0";
      slider.max = "10";
      slider.step = "0.1";
      slider.value = planet.data.speed;
      slider.id = `speed-${index}`;

      // Style the slider
      slider.style.flex = "1";
      slider.style.margin = "0 10px";
      slider.style.height = "6px";
      slider.style.background = "#333";
      slider.style.outline = "none";
      slider.style.borderRadius = "3px";

      const valueSpan = document.createElement("span");
      valueSpan.className = "speed-value";
      valueSpan.textContent = planet.data.speed.toFixed(1);
      valueSpan.style.width = "40px";
      valueSpan.style.fontSize = "0.8em";
      valueSpan.style.color = "#fff70cff";
      valueSpan.style.textAlign = "center";

      slider.addEventListener("input", (e) => {
        const newSpeed = parseFloat(e.target.value);
        planet.currentSpeed = newSpeed;
        valueSpan.textContent = newSpeed.toFixed(1);
      });

      controlDiv.appendChild(nameSpan);
      controlDiv.appendChild(slider);
      controlDiv.appendChild(valueSpan);
      controlsContainer.appendChild(controlDiv);
    });
  }

  setupEventListeners() {
    // Pause button
    document.getElementById("pause-btn").addEventListener("click", () => {
      this.isPaused = !this.isPaused;
      document.getElementById("pause-btn").textContent = this.isPaused
        ? "▶️ Resume"
        : "⏸️ Pause";
    });

    // Reset button
    document.getElementById("reset-btn").addEventListener("click", () => {
      this.resetSystem();
    });

    // Theme button
    document.getElementById("theme-btn").addEventListener("click", () => {
      this.toggleTheme();
    });

    // Window resize
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse hover for tooltips
    this.renderer.domElement.addEventListener("mousemove", (e) => {
      this.handleMouseHover(e);
    });
  }

  handleMouseHover(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.planets.map((p) => p.mesh).concat([this.sun])
    );

    const tooltip = document.getElementById("tooltip");

    if (intersects.length > 0) {
      const object = intersects[0].object;
      let info = "";

      if (object.name === "Sun") {
        info = "The Sun - Our solar system's star";
      } else {
        const planetInfo = this.planetData.find((p) => p.name === object.name);
        if (planetInfo) {
          info = `${object.name} - Distance: ${planetInfo.distance} AU`;
        }
      }

      tooltip.textContent = info;
      tooltip.style.left = event.clientX + 10 + "px";
      tooltip.style.top = event.clientY - 30 + "px";
      tooltip.style.opacity = "1";
    } else {
      tooltip.style.opacity = "0";
    }
  }
  resetSystem() {
    this.planets.forEach((planet, index) => {
      planet.currentSpeed = planet.data.speed;
      planet.angle = Math.random() * Math.PI * 2;
      document.getElementById(`speed-${index}`).value = planet.data.speed;
      document.querySelector(`#speed-${index}`).nextElementSibling.textContent =
        planet.data.speed.toFixed(1);
    });

    this.isPaused = false;
    document.getElementById("pause-btn").textContent = "⏸️ Pause";
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const themeBtn = document.getElementById("theme-btn");

    if (this.isDarkMode) {
      document.body.style.background =
        "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)";
      themeBtn.textContent = "🌙 Dark Mode";
    } else {
      document.body.style.background =
        "linear-gradient(135deg, #87CEEB 0%, #98D8E8 50%, #B6E2FF 100%)";
      themeBtn.textContent = "☀️ Light Mode";
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isPaused) {
      const elapsed = this.clock.getElapsedTime();

      this.sun.rotation.y += 0.01;

      this.planets.forEach((planet) => {
        planet.angle += planet.currentSpeed * 0.01;

        const x = Math.cos(planet.angle) * planet.data.distance;
        const z = Math.sin(planet.angle) * planet.data.distance;

        planet.mesh.position.x = x;
        planet.mesh.position.z = z;
        planet.mesh.rotation.y += 0.05;

        planet.orbitGroup.rotation.y = planet.angle;
      });

      // Animate stars
      this.stars.rotation.y += 0.0002;
    }

    this.renderer.render(this.scene, this.camera);
  }

  backgroundAudio() {
    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    const sound = new THREE.Audio(listener);
    this.backgroundAudio = sound;

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("audio/space-ambience.mp3", (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);

      // Wait for user click to start audio
      const enableAudio = () => {
        if (!sound.isPlaying) {
          sound.play();
          console.log("Audio started.");
        }
        window.removeEventListener("click", enableAudio);
      };

      window.addEventListener("click", enableAudio);
    });
  }
}

window.addEventListener("load", () => {
  new SolarSystem();
});
