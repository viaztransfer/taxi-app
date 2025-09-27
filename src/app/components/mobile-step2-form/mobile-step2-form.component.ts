import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type Tipo = 'aeropuerto'|'punto'|'hora';
type Categoria = 'sedan'|'minivan'|'suv'|'minibus'|'Van 16 asientos';
type CategoriaKey = 'sedan'|'minivan'|'suv'|'minibus'|'Van 16 asientos';

@Component({
  selector: 'app-mobile-step2-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-step2-form.component.html' // tu HTML ya lo tienes
  })
export class MobileStep2FormComponent {
  @Input() origin = '';
  @Input() destination = '';
  @Input() tipo!: Tipo;
  @Input() pax = 1;
  @Input() bags = 0;
  @Input() baby = 0;

  // 🟡 Eventos
  @Output() back = new EventEmitter<void>();
  @Output() continue = new EventEmitter<{pax:number;bags:number;baby:number;categoria:Categoria}>();

  // 🟡 Catálogo
  categorias = [
    { id: 'cat-sedan',   key: 'sedan'  as const,   label: 'Sedán',   img: 'assets/images/svg/sedan.png',   cap: 3 },
    { id: 'cat-minivan', key: 'minivan'as const,   label: 'Minivan', img: 'assets/images/svg/minivan.png', cap: 6 },
    { id: 'cat-suv',     key: 'suv'    as const,   label: 'SUV',     img: 'assets/images/svg/suv.png',     cap: 7 },
    { id: 'cat-minibus', key: 'minibus'as const,   label: 'Van 12',  img: 'assets/images/svg/van.png',     cap: 12 },
    { id: 'cat-van16',   key: 'Van 16 asientos' as const, label: 'Van 19', img: 'assets/images/svg/van.png', cap: 16 },
  ];
  LIM_CAP: Record<Categoria, {p:number;m:number}> = {
    sedan: { p:3,  m:3  },
    minivan: { p:6, m:6  },
    suv: { p:7, m:7 },
    minibus: { p:12, m:12 },
    'Van 16 asientos': { p:16, m:16 }
  };

  categoria: Categoria = 'sedan';

  bagsMax = this.LIM_CAP[this.categoria].m;
  private recomendarCategoria() {
    const orden: Categoria[] = ['sedan','minivan','suv','minibus','Van 16 asientos'];
    const compatible = orden.find(c => this.pax <= this.LIM_CAP[c].p && this.bags <= this.LIM_CAP[c].m);
    if (compatible) this.categoria = compatible;
    else this.categoria = 'Van 16 asientos'; // tope
  }

  setCategoria(cat: Categoria) {
    const lim = this.LIM_CAP[cat];
    // si no es compatible, empuja a lo mínimo compatible
    if (this.pax > lim.p || this.bags > lim.m) {
      this.recomendarCategoria();
    } else {
      this.categoria = cat;
    }
  }

  // Controles +
  inc(what: 'pax'|'bags'|'baby') {
    if (what==='pax')  this.pax  = Math.min(this.pax+1, 16);
    if (what==='bags') this.bags = Math.min(this.bags+1, 20);
    if (what==='baby') this.baby = Math.min(this.baby+1, 5);
    this.recomendarCategoria();
  }

  // Controles −
  dec(what: 'pax'|'bags'|'baby') {
    if (what==='pax')  this.pax  = Math.max(this.pax-1, 1);
    if (what==='bags') this.bags = Math.max(this.bags-1, 0);
    if (what==='baby') this.baby = Math.max(this.baby-1, 0);
    this.recomendarCategoria();
  }

  // Avanzar
  next() {
    this.continue.emit({
      pax: this.pax,
      bags: this.bags,
      baby: this.baby,
      categoria: this.categoria
    });
  }

  /* setCategoria(k:CategoriaKey){
    const lim = this.LIM_CAP[k];
    if (this.pax>lim.p) this.pax = lim.p;
    if (this.bags>lim.m) this.bags = lim.m;
    this.categoria = k;
    this.bagsMax = lim.m;
  }
  inc(what:'pax'|'bags'|'baby'){ if(what==='pax') this.pax++; if(what==='bags' && this.bags<this.bagsMax) this.bags++; if(what==='baby') this.baby++; }
  dec(what:'pax'|'bags'|'baby'){ if(what==='pax' && this.pax>1) this.pax--; if(what==='bags' && this.bags>0) this.bags--; if(what==='baby' && this.baby>0) this.baby--; }

  next(){ this.continue.emit({pax:this.pax,bags:this.bags,baby:this.baby,categoria:this.categoria}); }
 */}
