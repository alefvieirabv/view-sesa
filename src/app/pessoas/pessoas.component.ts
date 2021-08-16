import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tipo } from 'app/cadastro-pessoas/cadastro-pessoas.component';
import Swal from 'sweetalert2';
import { Contato } from './Contato';
import { Pessoa } from './Pessoa';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class Pessoas implements OnInit {

    valorTipo;
    public f: FormGroup;
    fContato: FormGroup;
    linhas: Array<Pessoa> = [];
    contatos: Array<Contato> = [];
    isInformacoes: boolean = false;
    isEditando: boolean = false;
    pessoaSelecionada;
    
    constructor(private http: HttpClient, private _fb: FormBuilder) {
    }

    tipos: Tipo[] = [
      {valor: 'TELEFONE', visualizacao: 'Telefone'},
      {valor: 'EMAIL', visualizacao: 'Email'},
      {valor: 'CELULAR', visualizacao: 'Celular'}
    ];

    incluirContato(contato) {
      this.valorTipo = contato.value.tipoContato;
      this.contatos.push(new Contato(contato.value.valor, contato.value.tipoContato));
      contato.reset();
    }
  
    removerContatoEdicao(contato) {
      this.contatos = this.contatos.filter(f => f != contato);
    }

    exibirEdicao(pessoa: Pessoa) {
      console.log(pessoa);
      this.pessoaSelecionada = pessoa;
      this.f.setValue({id: pessoa.id, nome: pessoa.nome, sobrenome: pessoa.sobrenome, cpf: pessoa.cpf});
      this.contatos = pessoa.contatos;
      this.isEditando = true;
    }

    fecharEdicao() {
      this.isEditando = false;
      this.contatos = [];
    }

    exibirInformacoes(pessoa: Pessoa) {
      this.pessoaSelecionada = pessoa;
      this.isInformacoes = true;
    }

    fecharInformacoes() {
      this.isInformacoes = false;
    }

    fetch() {           
        this.http.get<Pessoa[]>(('http://localhost:8080/pessoas'), {observe: 'response'})
            .subscribe(resp => {
                this.linhas = resp.body;
            }, error => {
              Swal.fire(
                'Problema na Operação',
                'Contacte o Administrador',
                'error'
              )
            });
    }

    ngOnInit() {
        this.fetch();
        this.f = this._fb.group({
          id: [''],
          nome: ['', Validators.required],
          sobrenome: ['', Validators.required],
          cpf: ['', Validators.required],
        });
        this.fContato = this._fb.group({
          valor: ['', [Validators.required]],
          tipoContato: ['', [Validators.required]],
        });
    }

    editar() {
      let pessoa = Object.assign({}, this.f.value);
      pessoa.cpf = pessoa.cpf.replace(/[^0-9]/g,'');
      pessoa.contatos = this.contatos;
      this.http.put<Pessoa>(('http://localhost:8080/pessoas/') + pessoa.id, pessoa, {observe: 'response'})
              .subscribe(resp => {
                Swal.fire('Realizado', 'Pessoa atualizada com sucesso!', 'success')
                this.ngOnInit();
                this.isEditando = false;
                this.contatos = [];
              }, error => {
                Swal.fire(
                  'Problema na Operação',
                  'Contacte o Administrador',
                  'error'
                )
              });
    }

    remover(pessoa: Pessoa) {
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não poderá recuperar esta pessoa!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, apague!',
        cancelButtonText: 'Não, mantê-la'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete<Pessoa[]>(('http://localhost:8080/pessoas/') + pessoa.id, {observe: 'response'}).subscribe(r => {
            Swal.fire(
              'Deletado!',
              'A pessoa foi deletada.',
              'success'
            )
        this.fetch();
          }, erros => {
            Swal.fire(
              'Problema na Operação',
              'Contacte o Administrador',
              'error'
            )
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'A Pessoa não foi apagada :)',
            'error'
          )
        }
      })

    }

}
