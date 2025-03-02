import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { Customer } from '../../customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customerId: number | null = null;
  isEditMode: boolean = false;
  formSubmitted: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.customerId = +params['id'];
        this.isEditMode = true;
        this.loadCustomerData(this.customerId);
      }
    });
  }

  loadCustomerData(id: number): void {
    this.customerService.getCustomerById(id).subscribe({
      next: (customer: Customer) => {
       
        const date = new Date(customer.dataNascimento);
        const formattedDate = 
          `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        this.customerForm.patchValue({
          nome: customer.nome,
          email: customer.email,
          telefone: customer.telefone,
          dataNascimento: formattedDate
        });
      },
      error: (error) => {
        console.error('Erro ao carregar dados do cliente:', error);
        alert('Não foi possível carregar os dados do cliente.');
        this.router.navigate(['/customers']);
      }
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.customerForm.invalid) {
      return;
    }

   
    const formData = { ...this.customerForm.value };
    if (formData.dataNascimento) {
      const parts = formData.dataNascimento.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; 
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        formData.dataNascimento = date.toISOString();
      }
    }

    if (this.isEditMode && this.customerId) {
      this.customerService.updateCustomer(this.customerId, formData).subscribe({
        next: () => {
          alert('Cliente atualizado com sucesso!');
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          console.error('Erro ao atualizar cliente:', error);
          alert('Erro ao atualizar cliente. Por favor, tente novamente.');
        }
      });
    } else {
      this.customerService.createCustomer(formData).subscribe({
        next: () => {
          alert('Cliente criado com sucesso!');
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          console.error('Erro ao criar cliente:', error);
          alert('Erro ao criar cliente. Por favor, tente novamente.');
        }
      });
    }
  }

  formatDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    if (value.length > 4) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4)}`;
    } else if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    
    this.customerForm.get('dataNascimento')?.setValue(value);
  }

  cancelar(): void {
    this.router.navigate(['/customers']);
  }
}