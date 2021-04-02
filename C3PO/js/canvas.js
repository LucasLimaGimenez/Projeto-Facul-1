(function () {
	const cnv = document.querySelector("#meuCanvas");
	const ctx = cnv.getContext("2d");

	const LARGURA = cnv.width;
	const ALTURA = cnv.height;

	const ESQUERDA = 37;
	const CIMA = 38;
	const DIREITA = 39;
	const BAIXO = 40;

	let moveEsquerda = moveCima = moveDireita = moveBaixo = false;

	const LEFT = 65;
	const UP = 87;
	const RIGHT = 68;
	const DOWN = 83;


	let moveEsquerda2 = moveCima2 = moveDireita2 = moveBaixo2 = false;

	const tamanhoBloco = 32;
	var tamanhoImagem = 96;
	let contadorBatidas = 0;

	var img = new Image();
	img.src = "img/img.png";
	img.addEventListener("load", function () {
		requestAnimationFrame(retorno, cnv);
	})


	const paredes = [];

	const jogador = {
		x: 34,
		y: 34,
		width: 33,
		height: 33,
		srcX: 0,
		srcY: tamanhoImagem,
		vida: 100
	};

	const jogador2 = {
		x: 578,
		y: 578,
		width: 33,
		height: 33,
		srcX: 0,
		srcY: tamanhoImagem + 35,
		vida: 100
	}


	const cenario = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
		[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
		[1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	];


	for (var linha in cenario) {
		for (var coluna in cenario[linha]) {
			var marcador = cenario[linha][coluna];

			if (marcador === 1) {
				var parede = {
					x: tamanhoBloco * coluna,
					y: tamanhoBloco * linha,
					width: tamanhoBloco,
					height: tamanhoBloco
				};

				paredes.push(parede);
			}
		}
	}


	function bloqueiaParede(objetoA, objetoB) {
		var distanciaX = (objetoA.x + objetoA.width / 2) - (objetoB.x + objetoB.width / 2);
		var distanciaY = (objetoA.y + objetoA.height / 2) - (objetoB.y + objetoB.height / 2);

		var somadorLargura = (objetoA.width + objetoB.width) / 2;
		var somadorAltura = (objetoA.height + objetoB.height) / 2;

		if (Math.abs(distanciaX) < somadorLargura && Math.abs(distanciaY) < somadorAltura) {
			var espacamentoX = somadorLargura - Math.abs(distanciaX);
			var espacamentoY = somadorAltura - Math.abs(distanciaY);

			if (espacamentoX > espacamentoY) {
				objetoA.y = distanciaY > 0 ? objetoA.y + espacamentoY : objetoA.y - espacamentoY;
			} else {
				objetoA.x = distanciaX > 0 ? objetoA.x + espacamentoX : objetoA.x - espacamentoX;
			}
		}
	}

	window.addEventListener("keydown", teclaPressionada, false);
	window.addEventListener("keyup", teclaSolta, false);

	function teclaPressionada(e) {
		const tecla = e.keyCode;

		if (tecla === ESQUERDA && tecla !== DIREITA) {
			moveEsquerda = true;
		}
		if (tecla === DIREITA && tecla !== ESQUERDA) {
			moveDireita = true;
		}
		if (tecla === CIMA && tecla !== BAIXO) {
			moveCima = true;
		}
		if (tecla === BAIXO && tecla !== CIMA) {
			moveBaixo = true;
		}
	}

	function teclaSolta(e) {
		const tecla = e.keyCode;

		if (tecla === ESQUERDA && tecla !== DIREITA) {
			moveEsquerda = false;
		}
		if (tecla === DIREITA && tecla !== ESQUERDA) {
			moveDireita = false;
		}
		if (tecla === CIMA && tecla !== BAIXO) {
			moveCima = false;
		}
		if (tecla === BAIXO && tecla !== CIMA) {
			moveBaixo = false;
		}
	}



	window.addEventListener("keydown", teclaPressionada2, false);
	window.addEventListener("keyup", teclaSolta2, false);

	function teclaPressionada2(e) {
		const tecla = e.keyCode;

		if (tecla === LEFT && tecla !== RIGHT) {
			moveEsquerda2 = true;
		}
		if (tecla === RIGHT && tecla !== LEFT) {
			moveDireita2 = true;
		}
		if (tecla === UP && tecla !== DOWN) {
			moveCima2 = true;
		}
		if (tecla === DOWN && tecla !== UP) {
			moveBaixo2 = true;
		}
	}

	function teclaSolta2(e) {
		const tecla = e.keyCode;

		if (tecla === LEFT && tecla !== RIGHT) {
			moveEsquerda2 = false;
		}
		if (tecla === RIGHT && tecla !== LEFT) {
			moveDireita2 = false;
		}
		if (tecla === UP && tecla !== DOWN) {
			moveCima2 = false;
		}
		if (tecla === DOWN && tecla !== UP) {
			moveBaixo2 = false;
		}
	}



	function atualizarMovimento() {
		if (moveEsquerda) {
			jogador.x -= 1.5;
		}
		if (moveDireita) {
			jogador.x += 1.5;
		}
		if (moveCima) {
			jogador.y -= 1.5;
		}
		if (moveBaixo) {
			jogador.y += 1.5;
		}

		if (moveEsquerda2) {
			jogador2.x -= 1.5;
		}
		if (moveDireita2) {
			jogador2.x += 1.5;
		}
		if (moveCima2) {
			jogador2.y -= 1.5;
		}
		if (moveBaixo2) {
			jogador2.y += 1.5;
		}

		for (var i in paredes) {
			var parede = paredes[i];
			bloqueiaParede(jogador, parede);
			bloqueiaParede(jogador2, parede);

		}
	}

	function renderizar() {
		ctx.clearRect(0, 0, LARGURA, ALTURA);
		ctx.save();
		for (var linha in cenario) {
			for (var coluna in cenario[linha]) {
				var marcador = cenario[linha][coluna];
				var x = coluna * tamanhoBloco;
				var y = linha * tamanhoBloco;

				ctx.drawImage(
					img,
					marcador * tamanhoImagem, 0, tamanhoImagem, tamanhoImagem,
					x, y, tamanhoBloco, tamanhoBloco
				);

			}
		}
		ctx.drawImage(
			img,
			jogador.srcX, jogador.srcY, jogador.width, jogador.height,
			jogador.x, jogador.y, jogador.width, jogador.height
		);
		ctx.restore();

		ctx.drawImage(
			img,
			jogador2.srcX, jogador2.srcY, jogador2.width, jogador2.height,
			jogador2.x, jogador2.y, jogador2.width, jogador2.height
		);
		ctx.restore();
	}

	function colisao() {

		if (jogador.x + jogador.width > jogador2.x &&
			jogador.x < jogador2.x + jogador2.width &&
			jogador.y + jogador.width > jogador2.y &&
			jogador.y < jogador2.y + jogador2.width) {

			jogador.x = 34;
			jogador.y = 34;
			jogador2.x = 574;
			jogador2.y = 574;

			jogador.vida -= perdeVida(0, 20);
			jogador2.vida -= perdeVida(0, 20);
			contadorBatidas++;
		}

		function perdeVida() {
			var resultado = Math.floor(Math.random() * 20);
			return resultado;
		}

		if (contadorBatidas === 5) {
			alert("Ambos os robôs ficaram sem potência!")
			if (jogador.vida > jogador2.vida) {
				alert("O ganhador da rodada foi: Jogador 1 com " + jogador.vida + " de vida");
				contadorBatidas++;
			} else {
				alert("O ganhador da rodada foi: Jogador 2 com " + jogador2.vida + " de vida");
				contadorBatidas++;
			}
		}

		if (contadorBatidas === 6) {
			jogador.x = 34;
			jogador.y = 34;
			jogador2.x = 574;
			jogador2.y = 574;

			alert("jogo finalizado por favor reinicie a pagina para jogar novamente!")
		}
	}



	function retorno() {
		atualizarMovimento();
		renderizar();
		requestAnimationFrame(retorno, cnv);
		colisao();
	}
	requestAnimationFrame(retorno, cnv);

}());






