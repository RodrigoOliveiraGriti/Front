import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customer.service'; // Caminho correto

@Component({
  selector: 'app-customer-list',
  standalone: true,
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: any[] = []; // Array para armazenar os dados dos clientes

  // Injetando o CustomerService no construtor
  constructor(private customerService: CustomerService) { }

  // Usando o ngOnInit para chamar a API assim que o componente for inicializado
  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(
      (data) => {
        this.customers = data; // Atribuindo os dados recebidos à variável customers
      },
      (error) => {
        console.error('Erro ao carregar clientes', error); // Tratamento de erro
      }
    );
  }

  // 🛠️ Corrigindo a posição da função deleteCustomer
  deleteCustomer(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        // Remove o cliente do array após a exclusão
        this.customers = this.customers.filter(c => c.id !== id);
      }, error => {
        console.error('Erro ao excluir cliente', error);
      });
    }
  }
}
