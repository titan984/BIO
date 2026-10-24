import "./Bio_page.css"
import avaImg from './ava.png';
import { useEffect, useRef } from 'react';
import 'boxicons/css/boxicons.min.css';
import { Footer } from "./Footer";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

interface Mouse {
    x: number | null;
    y: number | null;
    radius: number;
}

export default function Bio_page() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        // ИСПРАВЛЕНО: Канвас теперь равен строго размеру окна браузера
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const particles: Particle[] = [];
        const particleCount = 100; // Твое количество точек
        const connectionDistance = 120; // Твоя дистанция линий
        const mouse: Mouse = { x: null, y: null, radius: 110 }; 

        // Создание точек
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.2, 
                vy: (Math.random() - 0.5) * 1.2, 
                radius: Math.random() * 2 + 1.5,
            });
        }

        // ИСПРАВЛЕНО: Чистые координаты окна. Так как канвас зафиксирован, они работают идеально в любой точке сайта!
        const handleMouseMove = (e: MouseEvent) => {
            // e.pageX и e.pageY автоматически учитывают скролл страницы!
            mouse.x = e.pageX;
            mouse.y = e.pageY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            let particlesNearMouse = 0;
            const maxNearMouse = 5;

            if (mouse.x !== null && mouse.y !== null) {
                const rSq = mouse.radius * mouse.radius;
                for (let i = 0; i < particles.length; i++) {
                    const dx = mouse.x - particles[i].x;
                    const dy = mouse.y - particles[i].y;
                    if (dx * dx + dy * dy < rSq) {
                        particlesNearMouse++;
                    }
                }
            }

            const time = Date.now() * 0.002;

            // Расчет физики движения
            particles.forEach((p, index) => {
                let isAttracted = false;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < mouse.radius * mouse.radius) {
                        const distance = Math.sqrt(distSq);
                        if (particlesNearMouse <= maxNearMouse || distance < 40) {
                            isAttracted = true;

                            const baseOrbitRadius = 25 + (index % 3) * 12;
                            const wave = Math.sin(time + index * 0.5) * 8; 
                            const orbitRadius = baseOrbitRadius + wave;

                            const speedFactor = 0.8 + (index % 4) * 0.15;
                            const angle = time * speedFactor + index;

                            const targetX = mouse.x + Math.cos(angle) * orbitRadius;
                            const targetY = mouse.y + Math.sin(angle) * orbitRadius;

                            p.x += (targetX - p.x) * 0.012;
                            p.y += (targetY - p.y) * 0.012;

                            p.x += (Math.random() - 0.5) * 0.3;
                            p.y += (Math.random() - 0.5) * 0.3;
                        }
                    }
                }

                if (!isAttracted) {
                    p.x += p.vx;
                    p.y += p.vy;
                }

                if (p.x < 0) { p.x = 0; p.vx *= -1; }
                if (p.x > width) { p.x = width; p.vx *= -1; }
                if (p.y < 0) { p.y = 0; p.vy *= -1; }
                if (p.y > height) { p.y = height; p.vy *= -1; }
            });

            // БЛОК 1: ОТРИСОВКА НЕОНОВЫХ ТОЧЕК
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#1b9e49';
            ctx.fillStyle = 'rgba(27, 158, 73, 0.8)';
            
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();

            // БЛОК 2: ОТРИСОВКА ПАУТИНКИ ИЗ ЛИНИЙ
            ctx.lineWidth = 0.8;
            const connDistSq = connectionDistance * connectionDistance;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connDistSq) {
                        const dist = Math.sqrt(distSq);
                        const alpha = (1 - dist / connectionDistance) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(27, 158, 73, ${alpha})`;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <section className="bio">
                <canvas ref={canvasRef} className="bio__particles"></canvas>
                <div className="container">
                    <div className="bio__wrap">
                        <div className="bio__card">
                            <p className="bio__card-name">Developer</p>
                            <div className="bio__img-wrap">
                                <img src={avaImg} alt="avatar" className="bio__img" />
                            </div>
                            <p className="bio__card-name">Алексей Лунёв</p>
                        </div>
                        <div className="bio__links">
                            <a className="bio__tg" href="https://t.me" target="_blank" rel="noreferrer">
                                <i className="text-xl bx bxl-telegram"></i> @Nammename
                            </a>
                            <a className="bio__vk" href="https://vk.com" target="_blank" rel="noreferrer">
                                <i className="text-xl bx bxl-vk"></i> Алексей Лунёв
                            </a>
                            <a className="bio__mail" href="mailto:lunev_alexy@mail.ru">
                                <i className="text-xl bx bx-envelope"></i> lunev_alexy@mail.ru
                            </a>
                            <a className="bio__number" href="tel:+79127737701">
                                <i className="text-xl bx bx-phone"></i> +7 912 773 7701
                            </a>
                            <a className="bio__more-button" href="#more">О работе</a>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
