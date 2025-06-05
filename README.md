# CuratorApp - AI-Powered Product Recommendation Platform

## Overview

CuratorApp is a React Native/Expo application that provides AI-powered product recommendations based on user search queries and personalized buyer personas. The app leverages modern AI techniques to curate product suggestions that match user preferences and needs.

## System Architecture

### Technical Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      React Native UI                        │
│  ┌─────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │ Search Form │  │ Product Listing│  │ Product Details │   │
│  └─────────────┘  └────────────────┘  └─────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AIProductService                         │
│                                                             │
│  ┌─────────────────────┐      ┌───────────────────────┐     │
│  │ Query Processing    │      │ Embedding Generation  │     │
│  └─────────────────────┘      └───────────────────────┘     │
│                                                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────┐      ┌───────────────────────┐     │
│  │   Mock Data Store   │  OR  │   Database Service    │     │
│  │  (Development Mode) │      │   (Production Mode)   │     │
│  └─────────────────────┘      └───────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: React Native with Expo framework
- **State Management**: React Hooks (useState, useEffect)
- **UI Components**: Native React Native components
- **Gesture Handling**: react-native-gesture-handler
- **AI/ML**: Transformers.js for local embeddings (via @xenova/transformers)
- **Database**: PostgreSQL with Prisma ORM (for production)
- **API Integration**: OpenAI API for embeddings (in production mode)

### Core Components

#### 1. User Interface (App.js)

The main application interface consists of:

- Search input field for product queries
- Persona input field for customizing buyer preferences
- Product listing with basic details
- Detailed product view with comprehensive information
- Loading indicators for async operations

#### 2. AI Product Service (AIProductService.js)

Handles the core AI functionality:

- Product search based on user queries and personas
- Embedding generation for semantic search
- Mock data handling for development/testing

#### 3. Database Service (DatabaseService.js)

Manages data persistence and retrieval:

- Product storage with embeddings
- Similarity search using cosine similarity
- Database connection management

#### 4. Mock Data System (mockData.js)

Provides test data for development:

- Sample products with realistic attributes
- Structured to match production data schema

## Functional Specifications

### Search Functionality

1. **User Input**:
   - Text-based search queries
   - Customizable buyer persona descriptions

2. **Search Processing**:
   - Query embedding generation
   - Semantic similarity matching
   - Results filtering and ranking

3. **Results Display**:
   - List view of matching products
   - Detailed view with comprehensive product information

### Product Details

Each product contains:

- Basic information (title, price, link)
- Detailed description
- Feature list
- Purchase justification ("Why Buy")
- Review summaries from multiple platforms
- Pros and cons analysis
- Last updated timestamp

## Development Modes

### Test Mode

The application can run in test mode using mock data:

- No external API dependencies
- Predefined product dataset
- Simulated search functionality

### Production Mode

In production, the app would:

- Connect to a PostgreSQL database
- Generate embeddings via OpenAI API
- Perform real-time product scraping (not implemented in current version)
- Store and retrieve actual product data

## Implementation Details

### Data Flow

1. User enters search query and persona
2. App generates embeddings for the search query
3. System searches for similar products using vector similarity
4. Results are filtered and displayed to the user
5. User can view detailed information and (conceptually) purchase products

### Mock Data Structure

The mock data system provides realistic product entries with:

- Unique identifiers
- Descriptive titles and prices
- Detailed feature lists
- Review summaries from multiple platforms
- Pros and cons analysis

## Future Enhancements

1. **Backend Integration**:
   - Move from mock data to real product database
   - Implement actual product scraping from marketplaces

2. **AI Improvements**:
   - Enhanced embedding models
   - More sophisticated similarity algorithms
   - Personalized recommendation engine

3. **User Experience**:
   - User accounts and preferences
   - Purchase history tracking
   - Improved UI/UX design

4. **Infrastructure**:
   - Cloud database hosting
   - Serverless functions for API endpoints
   - Caching mechanisms for performance

## Project Structure

```
CuratorApp/
├── app/                      # Application code
│   ├── components/           # UI components
│   └── services/             # Business logic and services
│       ├── AIProductService.js  # AI-powered product service
│       ├── DatabaseService.js   # Database interactions
│       └── mockData.js          # Mock data for testing
├── assets/                   # Static assets
├── node_modules/             # Dependencies
├── App.js                    # Main application component
├── babel.config.js           # Babel configuration
├── index.js                  # Entry point
├── metro.config.js           # Metro bundler configuration
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
```

## Development Roadmap

### Phase 1: MVP with Mock Data (Current)
- Basic UI implementation
- Mock product data
- Search functionality with local filtering
- Product detail view

### Phase 2: AI Integration
- Implement embedding generation
- Add semantic search capabilities
- Enhance product recommendations based on personas

### Phase 3: Backend Development
- Set up PostgreSQL database
- Implement Prisma ORM integration
- Create API endpoints for product operations
- Add real-time product scraping

### Phase 4: Production Deployment
- Cloud infrastructure setup
- Security enhancements
- Performance optimizations
- Analytics integration

## Getting Started

### Prerequisites

- Node.js (v14+)
- Expo CLI
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npx expo start
   ```

### Testing

The application currently runs in test mode with mock data. No additional configuration is required for basic testing.

## Technical Limitations

- Currently uses mock data instead of real product database
- No actual web scraping implementation
- Limited to client-side processing
- No user authentication or personalization

## AI Capabilities

### Current Implementation

The application is designed to leverage AI in several ways:

1. **Semantic Search**:
   - Converting text queries into vector embeddings
   - Using cosine similarity to find semantically similar products
   - Ranking results based on relevance scores

2. **Persona-Based Recommendations**:
   - Incorporating buyer persona descriptions into search queries
   - Tailoring results to match specific user profiles
   - Contextualizing product relevance based on user needs

3. **Embedding Models**:
   - Using MiniLM-L6 model (384-dimensional embeddings) for semantic understanding
   - Supporting both local (Transformers.js) and cloud-based (OpenAI API) embedding generation
   - Fallback mechanisms for reliability

### Future AI Enhancements

1. **Advanced Recommendation Algorithms**:
   - Collaborative filtering based on user behavior
   - Content-based filtering using product attributes
   - Hybrid approaches combining multiple techniques

2. **Natural Language Processing**:
   - Enhanced query understanding and intent detection
   - Sentiment analysis of product reviews
   - Automatic summarization of product information

3. **Personalization**:
   - Learning user preferences over time
   - Adapting recommendations based on past interactions
   - Contextual awareness (time, location, etc.)

## Technical Challenges and Solutions

### Challenge 1: Cross-Platform Compatibility

**Problem**: Node.js modules like 'path' and filesystem operations aren't available in React Native.

**Solution**: Created a mock data system that simulates database operations without requiring Node.js-specific functionality.

### Challenge 2: Embedding Generation

**Problem**: Generating embeddings on mobile devices can be resource-intensive.

**Solution**: Implemented a tiered approach:
1. Use pre-computed embeddings when possible
2. Fall back to local lightweight models when necessary
3. Provide mock embeddings for testing scenarios

### Challenge 3: Database Integration

**Problem**: Connecting to PostgreSQL from React Native requires careful architecture.

**Solution**: Designed a service-based architecture that can work with both mock data and real database connections, allowing for easy switching between development and production modes.

### Challenge 4: UI Performance

**Problem**: Rendering large lists of products with complex details can impact performance.

**Solution**: Implemented efficient list rendering with FlatList, pagination, and optimized component rendering to maintain smooth user experience.

## License

[Specify license information]

## Contact

[Specify contact information] 
