import React, { useState, useEffect, useCallback } from 'react';
import './ConsultaBiblia.css';


const livros = [
    { nome: "Gênesis", capitulos: 50 },
    { nome: "Êxodo", capitulos: 40 },
    { nome: "Levítico", capitulos: 27 },
    { nome: "Números", capitulos: 36 },
    { nome: "Deuteronômio", capitulos: 34 },
    { nome: "Josué", capitulos: 24 },
    { nome: "Juízes", capitulos: 21 },
    { nome: "Rute", capitulos: 4 },
    { nome: "1 Samuel", capitulos: 31 },
    { nome: "2 Samuel", capitulos: 24 },
    { nome: "1 Reis", capitulos: 22 },
    { nome: "2 Reis", capitulos: 25 },
    { nome: "1 Crônicas", capitulos: 29 },
    { nome: "2 Crônicas", capitulos: 36 },
    { nome: "Esdras", capitulos: 10 },
    { nome: "Neemias", capitulos: 13 },
    { nome: "Ester", capitulos: 10 },
    { nome: "Jó", capitulos: 42 },
    { nome: "Salmos", capitulos: 150 },
    { nome: "Provérbios", capitulos: 31 },
    { nome: "Eclesiastes", capitulos: 12 },
    { nome: "Cânticos", capitulos: 8 },
    { nome: "Isaías", capitulos: 66 },
    { nome: "Jeremias", capitulos: 52 },
    { nome: "Lamentações", capitulos: 5 },
    { nome: "Ezequiel", capitulos: 48 },
    { nome: "Daniel", capitulos: 12 },
    { nome: "Oseias", capitulos: 14 },
    { nome: "Joel", capitulos: 3 },
    { nome: "Amós", capitulos: 9 },
    { nome: "Obadias", capitulos: 1 },
    { nome: "Jonas", capitulos: 4 },
    { nome: "Miquéias", capitulos: 7 },
    { nome: "Naum", capitulos: 3 },
    { nome: "Habacuque", capitulos: 3 },
    { nome: "Sofonias", capitulos: 3 },
    { nome: "Ageu", capitulos: 2 },
    { nome: "Zacarias", capitulos: 14 },
    { nome: "Malaquias", capitulos: 4 },
    { nome: "Mateus", capitulos: 28 },
    { nome: "Marcos", capitulos: 16 },
    { nome: "Lucas", capitulos: 24 },
    { nome: "João", capitulos: 21 },
    { nome: "Atos", capitulos: 28 },
    { nome: "Romanos", capitulos: 16 },
    { nome: "1 Coríntios", capitulos: 16 },
    { nome: "2 Coríntios", capitulos: 13 },
    { nome: "Gálatas", capitulos: 6 },
    { nome: "Efésios", capitulos: 6 },
    { nome: "Filipenses", capitulos: 4 },
    { nome: "Colossenses", capitulos: 4 },
    { nome: "1 Tessalonicenses", capitulos: 5 },
    { nome: "2 Tessalonicenses", capitulos: 3 },
    { nome: "1 Timóteo", capitulos: 6 },
    { nome: "2 Timóteo", capitulos: 4 },
    { nome: "Tito", capitulos: 3 },
    { nome: "Filemom", capitulos: 1 },
    { nome: "Hebreus", capitulos: 13 },
    { nome: "Tiago", capitulos: 5 },
    { nome: "1 Pedro", capitulos: 5 },
    { nome: "2 Pedro", capitulos: 3 },
    { nome: "1 João", capitulos: 5 },
    { nome: "2 João", capitulos: 1 },
    { nome: "3 João", capitulos: 1 },
    { nome: "Judas", capitulos: 1 },
    { nome: "Apocalipse", capitulos: 22 }
];

function ConsultaBiblia() {
    // Estados para gerenciar a UI e os dados
    const [livroIndex, setLivroIndex] = useState("");
    const [capitulo, setCapitulo] = useState("");
    const [versiculos, setVersiculos] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    // Variáveis derivadas do estado
    const livroSelecionado = livroIndex !== "" ? livros[parseInt(livroIndex)] : null;
    const maxCapitulos = livroSelecionado ? livroSelecionado.capitulos : 0;
    const capituloInt = parseInt(capitulo);

    // Função para buscar os versículos (Memoizada com useCallback)
    const carregarVersiculos = useCallback(async (livroIndex, capitulo) => {
        if (livroIndex === "" || capitulo === "") return;

        setCarregando(true);
        setErro(null);
        setVersiculos(null); // Limpa versículos anteriores

        const livroNome = livros[livroIndex].nome;
        const url = `https://bible-api.com/${encodeURIComponent(livroNome)}+${capitulo}?translation=almeida`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Erro ao buscar dados da Bíblia.");
            }
            const data = await response.json();
            
            if (!data.verses || data.verses.length === 0) {
                setVersiculos([]);
            } else {
                setVersiculos(data.verses);
            }
        } catch (error) {
            console.error("Erro na consulta à API:", error);
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }, []); // Dependências vazias, pois usa o estado/props via chamador ou função de mudança de estado

    // Handlers para os eventos de mudança
    const handleLivroChange = (event) => {
        setLivroIndex(event.target.value);
        setCapitulo(""); // Limpa o capítulo ao mudar o livro
        setVersiculos(null);
        setErro(null);
    };

    const handleCapituloChange = (event) => {
        setCapitulo(event.target.value);
        setVersiculos(null);
        setErro(null);
    };

    const handleMostrarVersiculos = () => {
        carregarVersiculos(livroIndex, capitulo);
    };

    // Handlers para os botões de navegação
    const navegarCapitulo = (direcao) => {
        const novoCapitulo = capituloInt + direcao;
        if (novoCapitulo >= 1 && novoCapitulo <= maxCapitulos) {
            setCapitulo(String(novoCapitulo));
            carregarVersiculos(livroIndex, String(novoCapitulo));
        }
    };

    // useEffect para buscar automaticamente os versículos após a navegação
    // Atualmente desativado para manter a funcionalidade do botão "Mostrar Versículos"
    /*
    useEffect(() => {
        if (livroIndex !== "" && capitulo !== "") {
            carregarVersiculos(livroIndex, capitulo);
        }
    }, [livroIndex, capitulo, carregarVersiculos]);
    */

    // Gerar opções de capítulos
    const capituloOptions = [];
    if (livroSelecionado) {
        for (let i = 1; i <= maxCapitulos; i++) {
            capituloOptions.push(<option key={i} value={i}>{i}</option>);
        }
    }

    return (
        <div className="container">
            <h1>Bíblia Sagrada - Antigo e Novo Testamento</h1>
            
            {/* Seletor de Livros */}
            <select id="livrosSelect" value={livroIndex} onChange={handleLivroChange}>
                <option value="">Selecione um livro</option>
                {livros.map((livro, index) => (
                    <option key={index} value={index}>{livro.nome}</option>
                ))}
            </select>
            
            {/* Seletor de Capítulos */}
            <select 
                id="capitulosSelect" 
                value={capitulo} 
                onChange={handleCapituloChange}
                disabled={livroIndex === ""}
            >
                <option value="">Selecione o capítulo</option>
                {capituloOptions}
            </select>

            {/* Botões de Navegação */}
            <div className="nav-buttons">
                <button 
                    id="btnAnterior" 
                    onClick={() => navegarCapitulo(-1)}
                    disabled={!livroSelecionado || capituloInt <= 1}
                >
                    Anterior
                </button>
                <button 
                    id="btnProximo" 
                    onClick={() => navegarCapitulo(1)}
                    disabled={!livroSelecionado || capituloInt >= maxCapitulos || maxCapitulos === 0}
                >
                    Próximo
                </button>
            </div>
            
            {/* Botão Mostrar Versículos */}
            <button 
                id="mostrarVersiculos" 
                onClick={handleMostrarVersiculos}
                disabled={livroIndex === "" || capitulo === "" || carregando}
            >
                {carregando ? 'Carregando...' : 'Mostrar Versículos'}
            </button>
            
            {/* Área de Exibição dos Versículos */}
            <div id="versiculos">
                {erro && <p style={{ color: 'red' }}>Erro: {erro}</p>}
                
                {!erro && carregando && <p>Carregando...</p>}
                
                {!erro && versiculos && versiculos.length > 0 && (
                    versiculos.map((v) => (
                        <p key={v.verse} className="versiculo">
                            <strong>{v.verse}:</strong> {v.text}
                        </p>
                    ))
                )}

                {!erro && versiculos && versiculos.length === 0 && (
                    <p>Nenhum versículo encontrado.</p>
                )}

                {!erro && versiculos === null && !carregando && (
                    <p>Selecione um livro e capítulo e clique em "Mostrar Versículos".</p>
                )}
            </div>
        </div>
    );
}

export default ConsultaBiblia;