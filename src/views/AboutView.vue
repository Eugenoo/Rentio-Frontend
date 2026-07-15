<!--<template>-->
<!--  <nav-bar></nav-bar>-->
<!--  <div class="about mt-20 ml-10">-->
<!--  </div>-->
<!--</template>-->

<template>
  <nav-bar></nav-bar>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>About Us</h1>
        <p>
          Your trusted partner for convenient, affordable, and reliable car rentals.
        </p>
      </div>
    </section>

    <!-- Story -->
    <section class="section">
      <div class="container">
        <div class="grid">
          <div>
            <h2>Who We Are</h2>
            <p>
              We are dedicated to making car rentals simple and stress-free.
              Whether you're planning a business trip, family vacation, or weekend
              getaway, we provide a wide selection of vehicles to meet your needs.
            </p>

            <p>
              Our mission is to deliver exceptional customer service, transparent
              pricing, and a seamless booking experience through modern technology.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"
            alt="Rental Car"
          />
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="container">
        <h2>Why Choose Us?</h2>

        <div class="cards">
          <div class="card">
            <div class="icon">🚗</div>
            <h3>Wide Vehicle Selection</h3>
            <p>
              Economy, SUVs, luxury cars, and family vehicles for every journey.
            </p>
          </div>

          <div class="card">
            <div class="icon">💰</div>
            <h3>Affordable Pricing</h3>
            <p>
              Competitive rates with no hidden charges and flexible rental plans.
            </p>
          </div>

          <div class="card">
            <div class="icon">🕒</div>
            <h3>24/7 Support</h3>
            <p>
              Our customer support team is available anytime you need assistance.
            </p>
          </div>

          <div class="card">
            <div class="icon">⭐</div>
            <h3>Trusted Service</h3>
            <p>
              Thousands of satisfied customers choose us for reliable transportation.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics -->
    <section class="stats">
      <div class="container stats-grid">
        <div>
          <h2>10K+</h2>
          <p>Happy Customers</p>
        </div>

        <div>
          <h2>500+</h2>
          <p>Available Cars</p>
        </div>

        <div>
          <h2>50+</h2>
          <p>Locations</p>
        </div>

        <div>
          <h2>24/7</h2>
          <p>Customer Support</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <h2>Ready to Start Your Journey?</h2>
        <p>
          Find the perfect vehicle and book your next ride in just a few clicks.
        </p>

        <router-link to="/" class="btn">
          Browse Cars
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import NavBar from '@/components/Navigation/NavBar.vue'
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.about-page {
  font-family: Arial, Helvetica, sans-serif;
  color: #333;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: auto;
}

.hero {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 90px 20px;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 15px;
}

.hero p {
  font-size: 1.2rem;
  max-width: 700px;
  margin: auto;
}

.section {
  padding: 80px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 50px;
  align-items: center;
}

.grid img {
  width: 100%;
  border-radius: 15px;
  object-fit: cover;
}

.features {
  background: #f8fafc;
  padding: 80px 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 50px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  transition: .3s;
  box-shadow: 0 4px 15px rgba(0,0,0,.08);
}

.card:hover {
  transform: translateY(-8px);
}

.icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.stats {
  padding: 70px 0;
  background: #1f2937;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px,1fr));
  text-align: center;
  gap: 30px;
}

.stats h2 {
  font-size: 2.4rem;
  color: #60a5fa;
}

.cta {
  text-align: center;
  padding: 80px 20px;
}

.btn {
  display: inline-block;
  margin-top: 25px;
  padding: 14px 30px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: .3s;
}

.btn:hover {
  background: #1d4ed8;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.3rem;
  }

  .hero {
    padding: 70px 20px;
  }

  .section,
  .features,
  .stats,
  .cta {
    padding: 60px 0;
  }
}
</style>
