import "./Bio_page.css"
import avaImg from './ava.png';
import { useEffect, useRef } from 'react';
import 'boxicons/css/boxicons.min.css';

function Bio_page() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const particles = [];
        const particleCount = 120; // Количество точек
        const connectionDistance = 120; // Дистанция для соединения линий
        const mouse = { x: null, y: null, radius: 110 }; // Зона притяжения к мыши

        // Создание точек
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.2, // Скорость по X
                vy: (Math.random() - 0.5) * 1.2, // Скорость по Y
                radius: Math.random() * 2 + 1.5,
            });
        }

        // Слушатели мыши и ресайза
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Считаем, сколько точек находится в радиусе мышки
            let particlesNearMouse = 0;
            const maxNearMouse = 8;

            if (mouse.x !== null && mouse.y !== null) {
                particles.forEach((p) => {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    if (Math.sqrt(dx * dx + dy * dy) < mouse.radius) {
                        particlesNearMouse++;
                    }
                });
            }

            // Счетчик времени для анимации кружения
            const time = Date.now() * 0.002;

            particles.forEach((p, index) => {
                let isAttracted = false;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        if (particlesNearMouse <= maxNearMouse || distance < 40) {
                            isAttracted = true;

                            // ДОБАВЛЕНО: Радиус орбиты теперь "дышит" (плавно сужается и расширяется во времени)
                            // Благодаря этому линии между точками будут постоянно менять длину и двигаться
                            const baseOrbitRadius = 25 + (index % 3) * 12;
                            const wave = Math.sin(time + index * 0.5) * 8; // Амплитуда дыхания орбиты в 8px
                            const orbitRadius = baseOrbitRadius + wave;

                            // ДОБАВЛЕНО: Каждая точка вращается со своей индивидуальной скоростью (умножаем time на коэффициент)
                            const speedFactor = 0.8 + (index % 4) * 0.15;
                            const angle = time * speedFactor + index;

                            const targetX = mouse.x + Math.cos(angle) * orbitRadius;
                            const targetY = mouse.y + Math.sin(angle) * orbitRadius;

                            // Плавное следование к постоянно меняющейся цели на орбите
                            p.x += (targetX - p.x) * 0.012;
                            p.y += (targetY - p.y) * 0.012;

                            // Внутренняя микро-вибрация точки
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

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(27, 158, 73, 0.8)';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#1b9e49';
                ctx.fill();
                ctx.shadowBlur = 0;

                particles.forEach((p2) => {
                    if (p === p2) return;
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(27, 158, 73, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                });
            });

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
        <section className="bio">
            {/* КАНВАС ДЛЯ ЧАСТИЦ */}
            <canvas ref={canvasRef} className="bio__particles"></canvas>

            <div className="container">
                <div className="bio__wrap">
                    <div className="bio__card">
                        <div className="bio__img-wrap">
                            <img src={avaImg} alt="avatar" className="bio__img" />
                        </div>
                        <p className="bio__card-name">Алексей Лунёв</p>
                    </div>
                    <div className="bio__links">
                        <a className="bio__tg" href="https://t.me/Nammename" target="_blank" rel="noreferrer">
                            <i className="bx bxl-telegram"></i> @Nammename
                        </a>
                        <a className="bio__vk" href="https://vk.com/id556647351" target="_blank" rel="noreferrer">
                            <i className="bx bxl-vk"></i> Алексей Лунёв
                        </a>
                        <a className="bio__mail" href="mailto:lunev_alexy@mail.ru">
                            <i className="bx bx-envelope"></i> lunev_alexy@mail.ru
                        </a>
                        <a className="bio__number" href="tel:+79127737701">
                            <i className="bx bx-phone"></i> +7 912 773 7701
                        </a>
                        <a className="bio__more-button" href="#more">О работе</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Bio_page