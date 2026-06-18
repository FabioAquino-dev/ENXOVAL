import { Category, LayetteItem } from "./types";

type Seed = Omit<
  LayetteItem,
  "id" | "purchased" | "realPrice" | "purchasedBy" | "purchasedAt" | "custom"
>;

let counter = 0;
function seed(s: Seed): LayetteItem {
  counter += 1;
  return {
    ...s,
    id: `seed-${counter}`,
    purchased: false,
    realPrice: null,
    purchasedBy: null,
    purchasedAt: null,
    custom: false,
    order: counter,
  };
}

function clothing(
  category: Category,
  name: string,
  detail: string,
  estimatedPrice: number,
  sizes: { RN?: number; P?: number; M?: number; G?: number },
): LayetteItem {
  return seed({ category, name, detail, unit: "peça", estimatedPrice, sizes });
}

function flat(
  category: Category,
  name: string,
  detail: string,
  unit: string,
  qtyNeeded: number,
  estimatedPrice: number,
): LayetteItem {
  return seed({ category, name, detail, unit, qtyNeeded, estimatedPrice });
}

export function buildDefaultItems(): LayetteItem[] {
  return [
    // Roupas
    clothing("Roupas", "Body manga longa", "liso ou estampado, sem capuz", 16, { RN: 4, P: 4, M: 2, G: 2 }),
    clothing("Roupas", "Body manga curta", "algodão, gola de boca larga", 14, { RN: 4, P: 4, M: 2, G: 2 }),
    clothing("Roupas", "Calça / legging com pé", "moletom leve, cintura elástica", 28, { RN: 3, P: 3, M: 2, G: 2 }),
    clothing("Roupas", "Macacão / pijama macacão", "com pezinho, abertura frontal", 38, { RN: 4, P: 4, M: 2, G: 2 }),
    clothing("Roupas", "Casaquinho / cardigan", "para dias frios", 45, { RN: 2, P: 2, M: 1, G: 1 }),
    clothing("Roupas", "Conjunto de passeio", "blusa + calça, sem estampa exagerada", 42, { RN: 2, P: 2, M: 2, G: 1 }),
    clothing("Roupas", "Pijama tecido grosso", "sem capuz e sem enfeites (segurança no sono)", 32, { RN: 3, P: 3, M: 2, G: 2 }),

    // Acessórios
    flat("Acessórios", "Meias", "pares, algodão", "par", 6, 7),
    flat("Acessórios", "Luvas", "pares, evita arranhões", "par", 4, 6),
    flat("Acessórios", "Gorro / touca", "para sair da maternidade e dias frios", "unidade", 2, 18),
    flat("Acessórios", "Babador", "algodão, dia a dia", "unidade", 6, 9),
    flat("Acessórios", "Sapatinho / meia-sapatilha", "para passeios", "unidade", 2, 22),
    flat("Acessórios", "Paninho de boca (fralda de boca)", "kit, para arroto e baba", "unidade", 10, 5),
    flat("Acessórios", "Manta / cueiro", "para envolver o bebê", "unidade", 3, 35),

    // Banho
    flat("Banho", "Toalha de banho com capuz", "felpuda, gola larga", "unidade", 3, 42),
    flat("Banho", "Banheira", "com suporte ou apoio anatômico", "unidade", 1, 95),
    flat("Banho", "Termômetro de banho", "para checar temperatura da água", "unidade", 1, 28),
    flat("Banho", "Kit higiene", "escova, pente, tesourinha, escova nasal", "kit", 1, 38),
    flat("Banho", "Sabonete líquido neutro", "para recém-nascido", "unidade", 2, 16),
    flat("Banho", "Shampoo neutro", "para recém-nascido", "unidade", 1, 19),
    flat("Banho", "Organizador de banho", "para sabonetes e acessórios", "unidade", 1, 25),

    // Sono e Quarto
    flat("Sono e Quarto", "Berço", "com grades reguláveis", "unidade", 1, 750),
    flat("Sono e Quarto", "Colchão de berço", "firme, conforme medida do berço", "unidade", 1, 220),
    flat("Sono e Quarto", "Protetor de colchão impermeável", "troca fácil", "unidade", 2, 55),
    flat("Sono e Quarto", "Jogo de lençol de berço", "3 peças, com elástico", "jogo", 3, 85),
    flat("Sono e Quarto", "Manta / cobertor de berço", "leve, respirável", "unidade", 2, 65),
    flat("Sono e Quarto", "Móbile musical", "estímulo visual e sonoro", "unidade", 1, 90),
    flat("Sono e Quarto", "Babá eletrônica", "áudio ou áudio + vídeo", "unidade", 1, 180),
    flat("Sono e Quarto", "Cômoda / trocador", "para troca de fraldas e roupas", "unidade", 1, 550),
    flat("Sono e Quarto", "Guarda-roupa infantil", "para organizar o enxoval", "unidade", 1, 650),
    flat("Sono e Quarto", "Cadeira de descanso (bouncer)", "vibratória ou balanço", "unidade", 1, 220),
    flat("Sono e Quarto", "Cabide infantil", "kit, para guarda-roupa", "kit", 1, 35),
    flat("Sono e Quarto", "Cesto de roupa suja", "para o quarto do bebê", "unidade", 1, 40),

    // Higiene e Saúde
    flat("Higiene e Saúde", "Fraldas descartáveis RN", "pacote", "pacote", 3, 32),
    flat("Higiene e Saúde", "Fraldas descartáveis P", "pacote", "pacote", 4, 38),
    flat("Higiene e Saúde", "Lenços umedecidos", "pacote (compre depois do nascimento, peso varia)", "pacote", 6, 28),
    flat("Higiene e Saúde", "Pomada para assadura", "uso diário na troca", "unidade", 2, 22),
    flat("Higiene e Saúde", "Álcool 70% + algodão", "cuidado do coto umbilical", "kit", 1, 14),
    flat("Higiene e Saúde", "Termômetro digital", "para febre", "unidade", 1, 25),
    flat("Higiene e Saúde", "Aspirador nasal", "tipo pera ou com filtro", "unidade", 1, 20),
    flat("Higiene e Saúde", "Lixeira para fraldas", "com sistema de vedação de odor", "unidade", 1, 130),

    // Alimentação
    flat("Alimentação", "Mamadeiras", "kit com 2, mesmo se for amamentar", "kit", 1, 65),
    flat("Alimentação", "Escova para mamadeira e bico", "limpeza", "unidade", 1, 18),
    flat("Alimentação", "Esterilizador de mamadeiras", "a vapor ou micro-ondas", "unidade", 1, 140),
    flat("Alimentação", "Babadores impermeáveis", "para fase de alimentação", "unidade", 3, 12),

    // Passeio e Transporte
    flat("Passeio e Transporte", "Carrinho de bebê", "compatível com idade/peso", "unidade", 1, 750),
    flat("Passeio e Transporte", "Bebê conforto (cadeirinha 0-13kg)", "obrigatório para sair da maternidade de carro", "unidade", 1, 480),
    flat("Passeio e Transporte", "Sling / canguru", "para colo prático", "unidade", 1, 95),
    flat("Passeio e Transporte", "Bolsa maternidade", "com trocador integrado", "unidade", 1, 190),
    flat("Passeio e Transporte", "Trocador portátil", "para usar fora de casa", "unidade", 1, 45),

    // Maternidade
    flat("Maternidade", "Kit saída de maternidade", "body, macacão, gorro, luvas e manta", "kit", 1, 130),
    flat("Maternidade", "Touca e luvas extras", "para o dia da alta", "kit", 1, 25),
  ];
}
