<template>
  <div id="app">

    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasic">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a> 
      </div>
      <div id="navbarBasic" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            <router-link to="/">Finder</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/copy">Copy</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/slides">Slides</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/settings">Settings</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/slideshow">Slideshow</router-link>
          </a>
        </div> 
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
// Import Bulma
@import "assets/bulma_variables";
</style>
