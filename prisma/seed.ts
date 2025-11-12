import { PrismaClient, Bucket } from '@prisma/client'
import { computeScoresForOrder } from '../lib/score'
import { getBucketBounds } from '../lib/constants'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user profile (you'll need to replace this with an actual Supabase user ID)
  const demoUserId = 'demo-user-id' // Replace with actual Supabase user ID
  const demoEmail = 'demo@homebeli.com'

  // Check if profile already exists
  let profile = await prisma.profile.findUnique({
    where: { userId: demoUserId },
  })

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        userId: demoUserId,
        email: demoEmail,
        name: 'Demo Chef',
      },
    })
    console.log('✅ Created demo profile')
  } else {
    console.log('ℹ️ Demo profile already exists')
  }

  // Clear existing demo dishes
  await prisma.dish.deleteMany({
    where: { userId: demoUserId },
  })
  console.log('🧹 Cleared existing demo dishes')

  // Create dishes for each bucket
  const dishesData = {
    NOT_GREAT: [
      {
        name: 'Overcooked Pasta',
        ingredients: ['Pasta', 'Tomato Sauce', 'Salt'],
        minutes: 20,
        recipe: 'Boiled pasta for too long, added basic tomato sauce.',
      },
      {
        name: 'Burnt Toast',
        ingredients: ['Bread', 'Butter'],
        minutes: 5,
        recipe: 'Left toast in toaster too long.',
      },
      {
        name: 'Soggy Cereal',
        ingredients: ['Cereal', 'Milk'],
        minutes: 2,
        recipe: 'Let cereal sit in milk for too long.',
      },
    ],
    AVERAGE: [
      {
        name: 'Basic Scrambled Eggs',
        ingredients: ['Eggs', 'Butter', 'Salt', 'Pepper'],
        minutes: 10,
        recipe: 'Whisk eggs, cook in butter until set. Season to taste.',
      },
      {
        name: 'Grilled Cheese Sandwich',
        ingredients: ['Bread', 'Cheese', 'Butter'],
        minutes: 8,
        recipe: 'Butter bread, add cheese, grill until golden on both sides.',
      },
      {
        name: 'Simple Tomato Soup',
        ingredients: ['Tomatoes', 'Onion', 'Garlic', 'Vegetable Stock', 'Cream'],
        minutes: 30,
        recipe: 'Sauté onion and garlic, add tomatoes and stock, simmer, blend, add cream.',
      },
      {
        name: 'Baked Potato',
        ingredients: ['Potato', 'Olive Oil', 'Salt'],
        minutes: 60,
        recipe: 'Rub potato with oil and salt, bake at 400°F for 60 minutes.',
      },
    ],
    REALLY_GOOD: [
      {
        name: "Grandma's Lasagna",
        ingredients: [
          'Lasagna Noodles',
          'Ground Beef',
          'Tomato Sauce',
          'Ricotta',
          'Mozzarella',
          'Parmesan',
          'Garlic',
          'Onion',
          'Italian Herbs',
        ],
        minutes: 120,
        recipe:
          'Layer noodles with meat sauce, ricotta mixture, and cheese. Bake at 375°F for 45 minutes.',
      },
      {
        name: 'Perfect Chocolate Chip Cookies',
        ingredients: [
          'Butter',
          'Brown Sugar',
          'White Sugar',
          'Eggs',
          'Vanilla',
          'Flour',
          'Baking Soda',
          'Salt',
          'Chocolate Chips',
        ],
        minutes: 25,
        recipe:
          'Cream butter and sugars, add eggs and vanilla, mix in dry ingredients, fold in chips, bake at 350°F for 10-12 minutes.',
      },
      {
        name: 'Homemade Pizza',
        ingredients: [
          'Pizza Dough',
          'Tomato Sauce',
          'Mozzarella',
          'Fresh Basil',
          'Olive Oil',
          'Garlic',
        ],
        minutes: 90,
        recipe:
          'Make dough from scratch, let rise, roll out, top with sauce and cheese, bake at 475°F for 12-15 minutes.',
      },
    ],
  }

  // Create dishes with proper ranking
  for (const [bucket, dishes] of Object.entries(dishesData)) {
    const bucketKey = bucket as Bucket
    const bounds = getBucketBounds(bucketKey)

    const dishIds: string[] = []

    // Create dishes first
    for (const dishData of dishes) {
      const dish = await prisma.dish.create({
        data: {
          userId: demoUserId,
          name: dishData.name,
          bucket: bucketKey,
          ingredients: dishData.ingredients,
          minutes: dishData.minutes,
          recipe: dishData.recipe,
          rankIndex: 0, // Temporary, will update
          score10: 0, // Temporary, will update
        },
      })
      dishIds.push(dish.id)
    }

    // Compute proper scores
    const scoreResults = computeScoresForOrder(dishIds, bounds)

    // Update all dishes with correct scores
    for (const result of scoreResults) {
      await prisma.dish.update({
        where: { id: result.id },
        data: {
          rankIndex: result.rankIndex,
          score10: result.score10,
        },
      })
    }

    console.log(`✅ Created ${dishes.length} dishes in ${bucket}`)
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

