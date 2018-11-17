(function(){
	class Animator {
		constructor(canvas, context){
			this.drawables = [];
			this.canvas = canvas;
			this.context = context || canvas.getContext('2d');
			this.timerId = -1
			this.canvas.width = this.context.width = window.innerWidth*2;
			this.canvas.height = this.context.height = window.innerHeight*2;
			this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)
		};

		draw(){
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
			for(var i of this.drawables){
				i.draw(this.context);
			}
		};

		update(){
			for(var i of this.drawables){
				i.update(this.drawables);
			}
			this.draw();
		};

		start(){
			if(this.timerId>0)
				clearInterval(this.timerId);
			this.timerId = window.setInterval(this.update.bind(this), 16);
		};

		stop(){
			if(this.timerId>0)
				clearInterval(this.timerId);
		};
	};

	class Clock {
		constructor(x, y, scale=1){
			this.center = {x:x*scale, y:y*scale}
			this.radius = (Math.min(window.innerWidth, window.innerHeight) / 2 - 200) * scale
			this.strokeThickness = 2 * scale
			this.circleThickness = 4 * scale
			this.strokeColor = "rgba(17, 17, 17, 1)"
			this.strokeStyle = "solid"
			this.fillColor = "rgba(0, 0, 0, 0)"
			this.scale=scale
		}

		draw(ctx){
			ctx.beginPath()
			ctx.strokeStyle = this.strokeColor
			ctx.fillStyle = this.fillColor
			ctx.ellipse(this.center.x, this.center.y, this.radius, this.radius, 0, 0, 360, false)
			ctx.fill()
			ctx.closePath()
			ctx.stroke()

			var startOfYear = new Date(new Date().getFullYear(), 0, 1)
			var endOfYear = new Date(new Date().getFullYear()+1, 0, 1)
			var lastMonth = -1

			ctx.beginPath()
			ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
			ctx.arc(this.center.x, this.center.y, this.radius, Math.PI/2, Math.PI/2 + Math.PI * 2 * (+new Date() - startOfYear) / (endOfYear - startOfYear), !true)
			ctx.lineTo(this.center.x, this.center.y)
			ctx.closePath()
			ctx.fill()


			ctx.beginPath()
			var d = new Date(startOfYear);
			const days = (endOfYear - startOfYear)/(1000*60*60*24);
			//days
			for(var i = 0; i<days; i++){
				var mx = -Math.sin(i/days*Math.PI*2)
				var my = Math.cos(i/days*Math.PI*2)
				var month = d.getMonth();

				var r = -3
				if(i%7 == 0)
					r = -10
				if(month != lastMonth){
					r = - this.radius / 3
					var s = ctx.strokeStyle;
					var lx = -Math.sin(i/days*Math.PI*2 + Math.PI/12)
					var ly = Math.cos(i/days*Math.PI*2 + Math.PI/12)

					ctx.strokeStyle = "black"
					ctx.fillStyle = "black"
					ctx.font = "32px sans-serif"
					ctx.textAlign = "center"
					ctx.stroke()
					ctx.beginPath();
					ctx.fillText(d.toLocaleString(navigator.language, { month: "long" }), this.center.x + (this.radius/2 + 80) * lx, this.center.y + (this.radius/2 + 80) * ly);
					ctx.closePath()
					ctx.fill()
					ctx.stroke()
					ctx.strokeStyle = s;
				}

				var rx = this.center.x + (this.radius) * mx;
				var ry = this.center.y + (this.radius) * my;

				ctx.strokeStyle = "black"
				ctx.moveTo(rx, ry);
				ctx.lineTo(rx + r * mx, ry + r * my)
				ctx.stroke()

				lastMonth = month
				d.setDate(d.getDate()+1) // increment day by 1
			}
			for(var d of dates){
				//do shit
				var positionStart = +(d.dateStart - startOfYear) / (endOfYear - startOfYear) * Math.PI * 2 + Math.PI/2
				var positionEnd = +(d.dateEnd - startOfYear) / (endOfYear - startOfYear) * Math.PI * 2 + Math.PI/2
				var mx = Math.cos(positionStart)
				var my = Math.sin(positionStart)
				var thickness = 10 * this.scale

				ctx.beginPath()
				ctx.moveTo(this.center.x + mx * (this.radius + thickness), this.center.y + my * (this.radius + thickness))
				//ctx.lineTo(this.center.x + mx * this.radius, this.center.y + my * this.radius);
				ctx.arc(this.center.x, this.center.y, this.radius - thickness, positionStart, (d.dateEnd-startOfYear)/(endOfYear-startOfYear) * Math.PI * 2 + Math.PI/2, false);
				ctx.arc(this.center.x, this.center.y, this.radius + thickness, (d.dateEnd-startOfYear)/(endOfYear-startOfYear) * Math.PI * 2 + Math.PI/2, positionStart, true);
				ctx.closePath()
				ctx.fillStyle = `hsla(${Math.floor(positionStart/Math.PI * 180)}, 100%, 50%, 0.5)`
				ctx.strokeStyle = `hsla(${Math.floor(positionStart/Math.PI * 180)}, 25%, 50%, 1)`
				ctx.fill();
				ctx.stroke();
			}
		}

		update(){
			this.center = {x:window.innerWidth / 2*this.scale, y:window.innerHeight/2*this.scale}
		}
	}

	class FullRect{
		constructor(color){
			this.color = color
		}
		draw(canvas){
			canvas.fillStyle = this.color
			canvas.fillRect(0, 0, canvas.width, canvas.height);
			canvas.fill();
		}
		update(){}
	}

	var dates = [
		{
			name: "MEGA",
			description: "",
			dateStart: new Date(2018, 11, 9),
			dateEnd: new Date(2018, 11, 11)
		},{
			name: "MEGA",
			description: "",
			dateStart: new Date(2018, 10, 9),
			dateEnd: new Date(2018, 10, 11)
		},{
			name: "MEGA",
			description: "",
			dateStart: new Date(2018, 9, 9),
			dateEnd: new Date(2018, 9, 11)
		},{
			name: "MEGA",
			description: "",
			dateStart: new Date(2018, 8, 9),
			dateEnd: new Date(2018, 8, 11)
		},{
			name: "MEGA",
			description: "",
			dateStart: new Date(2018, 7, 1),
			dateEnd: new Date(2018, 7, 31)
		},{
			name: "MEGA",
			description: "",
			dateStart: new Date(2018, 6, 9),
			dateEnd: new Date(2018, 6, 21)
		},{
			name: "MEGA",
			description: "",
			dateStart: new Date(2018, 5, 9),
			dateEnd: new Date(2018, 5, 17)
		},
	];

	var a = new Animator(document.querySelector('canvas'))
	//a.drawables.push(new FullRect("#eeeeee"))
	a.drawables.push(new Clock(1920/2+0.5, 1080/2+0.5, 2))
	a.start()
	window.canvas = a.context
})()
