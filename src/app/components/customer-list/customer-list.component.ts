import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { interval, Subscription } from 'rxjs';
import { startWith, mergeMap } from 'rxjs/operators';
import { Customer } from '../../customer.model';

@Component({
  selector: 'app-cliente-tabela',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  clientes: Customer[] = [];
  carregando: boolean = true;
  private sub: Subscription | null = null;

  constructor(
    private clienteService: CustomerService,
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.iniciarAtualizacaoPeriodica();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  iniciarAtualizacaoPeriodica(): void {
    this.carregando = true;
    
    this.ngZone.runOutsideAngular(() => {
      this.sub = interval(30 * 1000)
        .pipe(
          startWith(0),
          mergeMap(() => this.clienteService.getCustomers())
        )
        .subscribe({
          next: (data: Customer[]) => {
            this.ngZone.run(() => {
              this.clientes = data;
              this.carregando = false;
            });
          },
          error: (erro: any) => {
            this.ngZone.run(() => {
              console.error('Erro ao carregar clientes:', erro);
              this.carregando = false;
            });
          }
        });
    });
  }

  editarCliente(id: number): void {
    this.router.navigate(['/customers/editar', id]);
  }

  excluirCliente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.deleteCustomer(id).subscribe({
        next: () => {
          if (this.sub) {
            this.sub.unsubscribe();
          }
          this.iniciarAtualizacaoPeriodica();
        },
        error: (erro: any) => {
          console.error('Erro ao excluir cliente:', erro);
        }
      });
    }
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  adicionarNovoCliente(): void {
    this.router.navigate(['/customers/novo']);
  }
}