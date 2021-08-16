import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contato } from 'app/pessoas/Contato';
import { Pessoa } from 'app/pessoas/Pessoa';
import Swal from 'sweetalert2';

export interface Tipo {
  valor: string;
  visualizacao: string;
}

@Component({
  selector: 'app-cadastro-pessoas',
  templateUrl: './cadastro-pessoas.component.html',
  styleUrls: ['./cadastro-pessoas.component.css']
})

export class CadastroPessoas implements OnInit {

  valorTipo;
  f: FormGroup;
  fContato: FormGroup;
  contatos: Array<Contato> = [];
  constructor(private http: HttpClient, private _fb: FormBuilder) { }

  tipos: Tipo[] = [
    {valor: 'TELEFONE', visualizacao: 'Telefone'},
    {valor: 'EMAIL', visualizacao: 'Email'},
    {valor: 'CELULAR', visualizacao: 'Celular'}
  ];

  salvar() {
    let pessoa = Object.assign({}, this.f.value);
    pessoa.cpf = pessoa.cpf.replace(/[^0-9]/g,'');
    pessoa.contatos = this.contatos;

    this.http.post<Pessoa>(('http://localhost:8080/pessoas'), pessoa, {observe: 'response'})
            .subscribe(resp => {
              Swal.fire(
                'Cadastrado!',
                'A Pessoa foi Cadastrada com Sucesso.',
                'success'
              )
              this.ngOnInit();
              this.contatos = [];
            }, error => {
              Swal.fire(
                'Problema na Operação',
                'Contacte o Administrador',
                'error'
              )
            });
  }

  incluirContato(contato) {
    this.valorTipo = contato.value.tipoContato;
    this.contatos.push(new Contato(contato.value.valor, contato.value.tipoContato));
    contato.reset();
  }

  remover(contato) {
    this.contatos = this.contatos.filter(f => f != contato);
  }

  ngOnInit() {
    this.f = this._fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      cpf: ['', Validators.required],
    });
    this.fContato = this._fb.group({
      valor: ['', [Validators.required]],
      tipoContato: ['', [Validators.required]],
    });
  }

  
}
