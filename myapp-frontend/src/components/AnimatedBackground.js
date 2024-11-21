import React, { useEffect } from 'react';
import './AnimatedBackground.css';
import { gsap, Circ } from 'gsap';

const AnimatedBackground = () => {
  useEffect(() => {
    let width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    const initHeader = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      target = { x: width / 2, y: height / 2 };

      largeHeader = document.getElementById('large-header');
      largeHeader.style.height = `${height}px`;

      canvas = document.getElementById('demo-canvas');
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');

      // create points
      points = [];
      for (let x = 0; x < width; x += width / 20) {
        for (let y = 0; y < height; y += height / 20) {
          const px = x + Math.random() * width / 20;
          const py = y + Math.random() * height / 20;
          const p = { x: px, originX: px, y: py, originY: py };
          points.push(p);
        }
      }

      // for each point find the 5 closest points
      for (let i = 0; i < points.length; i++) {
        const closest = [];
        const p1 = points[i];
        for (let j = 0; j < points.length; j++) {
          const p2 = points[j];
          if (!(p1 === p2)) {
            let placed = false;
            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (closest[k] === undefined) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }

            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }
          }
        }
        p1.closest = closest;
      }

      // assign a circle to each point
      for (const point of points) {
        const c = new Circle(point, 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
        point.circle = c;
      }

      // Event handling
      const mouseMove = (e) => {
        let posx = 0;
        let posy = 0;
        if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
        } else if (e.clientX || e.clientY) {
          posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
      };

      const scrollCheck = () => {
        if (document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
      };

      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        largeHeader.style.height = `${height}px`;
        canvas.width = width;
        canvas.height = height;
      };

      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('scroll', scrollCheck);
      window.addEventListener('resize', resize);

      // animation
      const animate = () => {
        if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (const point of points) {
            // detect points in range
            if (Math.abs(getDistance(target, point)) < 4000) {
              point.active = 0.3;
              point.circle.active = 0.6;
            } else if (Math.abs(getDistance(target, point)) < 8000) {
              point.active = 0.1;
              point.circle.active = 0.3;
            } else if (Math.abs(getDistance(target, point)) < 16000) {
              point.active = 0.02;
              point.circle.active = 0.1;
            } else {
              point.active = 0;
              point.circle.active = 0;
            }

            drawLines(point);
            point.circle.draw();
          }
        }
        requestAnimationFrame(animate);
      };

      const shiftPoint = (p) => {
        gsap.to(p, {
          duration: 1 + 1 * Math.random(),
          x: p.originX - 50 + Math.random() * 100,
          y: p.originY - 50 + Math.random() * 100,
          ease: Circ.easeInOut,
          onComplete: () => {
            shiftPoint(p);
          },
        });
      };

      for (const point of points) {
        shiftPoint(point);
      }

      animate();
    };

    const drawLines = (p) => {
      if (!p.active) return;
      for (const closest of p.closest) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(closest.x, closest.y);
        ctx.strokeStyle = `rgba(156,217,249,${p.active})`;
        ctx.stroke();
      }
    };

    const Circle = function (pos, rad, color) {
      const _this = this;

      // constructor
      (function () {
        _this.pos = pos || null;
        _this.radius = rad || null;
        _this.color = color || null;
      })();

      this.draw = function () {
        if (!_this.active) return;
        ctx.beginPath();
        ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = `rgba(156,217,249,${_this.active})`;
        ctx.fill();
      };
    };

    const getDistance = (p1, p2) => {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    };

    initHeader();
  }, []);

  return (
    <div id="large-header" className="large-header">
      <canvas id="demo-canvas"></canvas>
    </div>
  );
};

export default AnimatedBackground;