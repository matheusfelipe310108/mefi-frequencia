const HORAS_POR_OFICINA = 4;

let alunos = [];
let oficinas = [];
let frequencias = [];

document.addEventListener("DOMContentLoaded", iniciarSistema);

async function iniciarSistema() {

    console.log("Sistema MEFI iniciado.");

    carregarOficinas();

    atualizarInterface();
}


/* ==========================================
   OFICINAS
========================================== */

function carregarOficinas() {

    oficinas = [

        {
            numero: 1,
            data: "15/08/2026"
        },

        {
            numero: 2,
            data: "22/08/2026"
        },

        {
            numero: 3,
            data: "29/08/2026"
        },

        {
            numero: 4,
            data: "05/09/2026"
        },

        {
            numero: 5,
            data: "12/09/2026"
        },

        {
            numero: 6,
            data: "19/09/2026"
        },

        {
            numero: 7,
            data: "26/09/2026"
        },

        {
            numero: 8,
            data: "03/10/2026"
        },

        {
            numero: 9,
            data: "10/10/2026"
        },

        {
            numero: 10,
            data: "17/10/2026"
        },

        {
            numero: 11,
            data: "24/10/2026"
        },

        {
            numero: 12,
            data: "31/10/2026"
        }

    ];

    const select = document.getElementById("oficinaSelect");

    select.innerHTML = "";

    oficinas.forEach(oficina => {

        const option = document.createElement("option");

        option.value = oficina.numero;

        option.textContent =
            `Oficina ${oficina.numero} — ${oficina.data}`;

        select.appendChild(option);

    });

}


/* ==========================================
   INTERFACE
========================================== */

function atualizarInterface() {

    document.getElementById("totalOficinas").textContent =
        oficinas.length;

    document.getElementById("totalAlunos").textContent =
        alunos.length;

    atualizarTabelaFrequencia();

    atualizarResumo();

}


/* ==========================================
   TABELA DE FREQUÊNCIA
========================================== */

function atualizarTabelaFrequencia() {

    const tabela =
        document.getElementById("attendanceTable");

    tabela.innerHTML = "";

    const turmaSelecionada =
        Number(document.getElementById("turmaSelect").value);

    const alunosDaTurma =
        alunos.filter(aluno =>
            aluno.turma === turmaSelecionada
        );


    if (alunosDaTurma.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">
                    Nenhum aluno cadastrado nesta turma.
                </td>
            </tr>
        `;

        return;
    }


    alunosDaTurma.forEach(aluno => {

        const linha =
            document.createElement("tr");


        const frequenciaAluno =
            frequencias.find(
                registro =>
                    registro.alunoId === aluno.id
            );


        const presente =
            frequenciaAluno?.presente || false;


        linha.innerHTML = `

            <td>
                <strong>
                    ${aluno.nome}
                </strong>
            </td>

            <td>

                <button
                    class="button ${presente ? "" : "secondary"}"
                    onclick="registrarPresenca(${aluno.id})"
                >
                    ${presente ? "✓ Presente" : "Marcar presença"}
                </button>

            </td>

            <td>
                ${presente ? HORAS_POR_OFICINA + "h" : "0h"}
            </td>

        `;


        tabela.appendChild(linha);

    });

}


/* ==========================================
   REGISTRAR PRESENÇA
========================================== */

function registrarPresenca(alunoId) {

    const oficinaSelecionada =
        Number(
            document.getElementById("oficinaSelect").value
        );


    const registroExistente =
        frequencias.find(
            registro =>
                registro.alunoId === alunoId &&
                registro.oficina === oficinaSelecionada
        );


    if (registroExistente) {

        registroExistente.presente =
            !registroExistente.presente;

    } else {

        frequencias.push({

            alunoId: alunoId,

            oficina: oficinaSelecionada,

            presente: true,

            horas: HORAS_POR_OFICINA

        });

    }


    salvarDadosLocalmente();

    atualizarInterface();

}


/* ==========================================
   RESUMO DOS ALUNOS
========================================== */

function atualizarResumo() {

    const tabela =
        document.getElementById("summaryTable");

    tabela.innerHTML = "";


    if (alunos.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Nenhum aluno cadastrado ainda.
                </td>
            </tr>
        `;

        return;
    }


    alunos.forEach(aluno => {

        const registros =
            frequencias.filter(
                registro =>
                    registro.alunoId === aluno.id
            );


        const presencas =
            registros.filter(
                registro =>
                    registro.presente
            ).length;


        const faltas =
            oficinas.length - presencas;


        const horas =
            presencas * HORAS_POR_OFICINA;


        const percentual =
            oficinas.length > 0
                ? (presencas / oficinas.length) * 100
                : 0;


        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>
                <strong>
                    ${aluno.nome}
                </strong>
            </td>

            <td>
                Turma ${aluno.turma}
            </td>

            <td>
                ${presencas}
            </td>

            <td>
                ${faltas}
            </td>

            <td>
                ${horas}h
            </td>

            <td>
                ${percentual.toFixed(1)}%
            </td>

        `;


        tabela.appendChild(linha);

    });

}


/* ==========================================
   ARMAZENAMENTO TEMPORÁRIO
========================================== */

function salvarDadosLocalmente() {

    localStorage.setItem(
        "mefi_frequencias",
        JSON.stringify(frequencias)
    );

}


function carregarDadosLocalmente() {

    const dados =
        localStorage.getItem(
            "mefi_frequencias"
        );


    if (dados) {

        frequencias =
            JSON.parse(dados);

    }

}


/* ==========================================
   EVENTOS
========================================== */

document
    .getElementById("turmaSelect")
    .addEventListener(
        "change",
        atualizarTabelaFrequencia
    );


document
    .getElementById("oficinaSelect")
    .addEventListener(
        "change",
        atualizarTabelaFrequencia
    );


document
    .getElementById("refreshButton")
    .addEventListener(
        "click",
        atualizarInterface
    );


carregarDadosLocalmente();
