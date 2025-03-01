import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Importando o HttpClientModule
import { HttpClient } from '@angular/common/http'; // Para fazer as requisições HTTP

// Importando os componentes que você criou
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomerListComponent, CustomerFormComponent, CustomerDetailsComponent, HttpClientModule], // Adicionando o HttpClientModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrigido (antes estava 'styleUrl')
})
export class AppComponent {
  title = 'TesteJr';

  constructor(private http: HttpClient) { }

  // Você pode usar o HttpClient aqui para fazer as requisições
  getData() {
    this.http.get('http://localhost:5000/api/customers').subscribe(
      (data) => {
        console.log(data); // Exibir dados no console
      },
      (error) => {
        console.error('Erro ao buscar dados', error);
      }
    );
  }
}
