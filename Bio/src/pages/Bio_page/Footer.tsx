import React from 'react';
import 'boxicons/css/boxicons.min.css';
import "./Footer.css"

interface Skill {
  name: string;
  iconClass: string;
  color: string; // Добавляем обязательное поле цвета
}

const SKILLS_DATA: Skill[] = [
  { name: 'HTML', iconClass: 'bx bxl-html5', color: '#e34f26' },        // Оранжевый
  { name: 'CSS', iconClass: 'bx bxl-css3', color: '#1572b6' },          // Синий
  { name: 'SASS', iconClass: 'bx bxl-sass', color: '#cc6699' },         // Розовый
  { name: 'BEM', iconClass: 'bx bx-code-alt', color: '#e34f26' },       // Оранжевый (как просили)
  { name: 'JavaScript', iconClass: 'bx bxl-javascript', color: '#f7df1e' }, // Желтый
  { name: 'TypeScript', iconClass: 'bx bxl-typescript', color: '#007acc' }, // Голубой
  { name: 'React', iconClass: 'bx bxl-react', color: '#61dafb' },       // Светло-голубой
  { name: 'NodeJs', iconClass: 'bx bxl-nodejs', color: '#339933' },     // Зеленый
  { name: 'Python', iconClass: 'bx bxl-python', color: '#3776ab' },     // Сине-голубой
];

export const Footer: React.FC = () => {
  return (
    <section className="footer">
      <div className="footer__container">
        <div className="footer__wrap">
          <p className="footer__header">Стек технологий</p>
          <ul className="footer__list">
            {SKILLS_DATA.map((skill) => (
              <li 
                key={skill.name} 
                className="footer__item"
                // Передаем цвет в CSS-переменную, чтобы использовать ее в файле стилей
                style={{ '--brand-color': skill.color } as React.CSSProperties}
              >
                {/* Иконка окрасится в свой цвет */}
                <i className={`${skill.iconClass} footer__icon`}></i>
                <span className="footer__text">{skill.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
