# ggizi
Aplicação aberta com diversas funcionalidades que consolidam dados fornecidos pela API da Riot (League of Legends).

# Ferramentas Requeridas 

GitBash: http://git-scm.com/downloads

Node.js: http://nodejs.org/

# Windows:

* Instale o GitBash e o Node.js. 
* Após instalar o Node.js, inclua o path dos binários na variável de ambiente "Path".
* Abra o terminal do gitbash e:

```sh
$ git clone git://github.com/jairoandre/ggizi
$ cd ggizi
$ npm -g install grunt-cli karma bower
$ npm install
$ bower install
$ grunt watch
```
# Ajustes

Para que os estilos do bootstrap consigam referenciar corretamente os ícones, é necessário realizar uma pequena alteração no seguinte arquivo:

```sh
ggizi\vendor\bootstrap\less\variables
```
Alterar as seguinte varíavel:

```sh
@icon-font-path:          "../assets/";
```
