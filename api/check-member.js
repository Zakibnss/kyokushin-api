// api/check-member.js
const { createClient } = require('@supabase/supabase-js');

// Initialiser Supabase
const supabase = createClient(
  'https://gmoyoflorwaltuanfswn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtb3lvZmxvcndhbHR1YW5mc3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTc0OTIsImV4cCI6MjA3NzczMzQ5Mn0.Yr0SFLvcPNbvRqNSjzwFdTZkrIz3Z6WZxcIyx8gwjZA'
);

// Clé API sécurisée (à changer)
const API_SECRET = 'kyokushin2024';

module.exports = async (req, res) => {
  // Configurer CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vérifier que c'est une requête POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Méthode non autorisée' 
    });
  }

  try {
    // Vérifier la clé API (optionnel mais recommandé)
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${API_SECRET}`) {
      return res.status(401).json({ 
        success: false, 
        error: 'Non autorisé' 
      });
    }

    // Récupérer les données
    const { memberId, clubId } = req.body;

    console.log('🔍 Recherche membre:', { memberId, clubId });

    // Valider les paramètres
    if (!memberId || !clubId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID membre et club requis' 
      });
    }

    // Rechercher le membre dans Supabase
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .eq('club_id', clubId)
      .single();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return res.status(404).json({ 
        success: false, 
        error: 'Membre non trouvé' 
      });
    }

    if (!member) {
      return res.status(404).json({ 
        success: false, 
        error: 'Membre non trouvé' 
      });
    }

    console.log('✅ Membre trouvé:', member.first_name, member.last_name);

    // Retourner les données du membre
    res.status(200).json({
      success: true,
      data: member
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    });
  }
};
