# FireApp

FireApp é um sistema web desenvolvido em PHP utilizando o framework Laravel.
A seguir estão as instruções básicas para instalar o projeto e uma visão
geraldas telas e funcionalidades.

## Requisitos

- PHP >= 8.2
- Composer
- MySQL ou outro banco compatível
- Node.js e NPM para compilação dos assets

## Instalação

1. Crie o projeto Laravel (ou clone este repositório):
   ```bash
   composer create-project laravel/laravel fireapp
   cd fireapp
   ```
2. Instale as dependências:
   ```bash
   composer install
   npm install && npm run build
   ```
3. Copie `.env.example` para `.env` e configure as credenciais de banco.
4. Gere a chave da aplicação:
   ```bash
   php artisan key:generate
   ```
5. Execute as migrações:
   ```bash
   php artisan migrate
   ```
6. Inicie o servidor local:
   ```bash
   php artisan serve
   ```

## Telas e funcionalidades

1. **Cadastro de Usuário**
   - Nome, e-mail, telefone e tipo (Cidadão, Bombeiro, Autoridade).
   - Senha com validação e verificação de força em tempo real.

2. **Login**
   - Campos de e-mail e senha, com link para recuperação de senha.

3. **Cadastro de Incêndios**
   - Tipo (vegetacão, plantação, pasto, floresta), gravidade, descrição e ponto de referência.
   - Mapa interativo para marcar a área afetada.

4. **Alertas de Incêndio**
   - Lista e visualização em mapa com marcadores personalizados.
   - Exibe tipo, gravidade, tempo decorrido e distância do usuário.

5. **Painel Administrativo**
   - Estatísticas resumidas de incêndios.
   - Filtros por status, região e período.
   - Atualização do status das ocorrências.

6. **Configurações do Usuário**
   - Atualização de perfil e preferências de notificação.
   - Opções de privacidade (perfil público, compartilhar localização).

7. **Tela Inicial**
   - Destaque para alerta rápido, mapeamento preciso e colaboração.

## Estrutura de código exemplo

Abaixo segue um exemplo simplificado de migração, rotas e controlador.

### Migração de Incêndios

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('incendios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('tipo', ['vegetacao', 'plantacao', 'pasto', 'floresta']);
            $table->enum('gravidade', ['baixa', 'media', 'alta']);
            $table->text('descricao');
            $table->string('ponto_referencia')->nullable();
            $table->polygon('area');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incendios');
    }
};
```

### Rotas

```php
use App\Http\Controllers\IncendioController;

Route::middleware(['auth'])->group(function () {
    Route::get('/incendios/create', [IncendioController::class, 'create']);
    Route::post('/incendios', [IncendioController::class, 'store']);
});
```

### Controlador básico

```php
namespace App\Http\Controllers;

use App\Models\Incendio;
use Illuminate\Http\Request;

class IncendioController extends Controller
{
    public function create()
    {
        return view('incendios.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo' => 'required|in:vegetacao,plantacao,pasto,floresta',
            'gravidade' => 'required|in:baixa,media,alta',
            'descricao' => 'required|string',
            'ponto_referencia' => 'nullable|string',
            'area' => 'required',
        ]);

        $request->user()->incendios()->create($data);

        return redirect()->route('dashboard')
            ->with('success', 'Incêndio registrado com sucesso!');
    }
}
```

## Considerações finais

- Utilize a API do Google Maps para o mapa interativo e cálculo de distância.
- Para notificações em tempo real, considere WebSockets com Laravel Echo.
- A autenticação pode ser configurada com Laravel Breeze ou Jetstream.

