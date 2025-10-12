#!/bin/bash

# RankLLM Integration Test Script
# Tests the complete integration from frontend to microservice

set -e

echo "🧪 Starting RankLLM Integration Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
MICROSERVICE_URL=${RANKLLM_SERVICE_URL:-"http://localhost:8000"}
SUPABASE_URL=${SUPABASE_URL:-"http://localhost:54321"}
TEST_DOMAIN="test-integration.com"

# Helper functions
log_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if microservice is running
check_microservice() {
    log_info "Checking microservice health..."
    
    if curl -s -f "$MICROSERVICE_URL/health" > /dev/null; then
        log_success "Microservice is running"
        return 0
    else
        log_error "Microservice is not running at $MICROSERVICE_URL"
        log_info "Please start the microservice with: cd rank-llm-service && docker-compose up"
        return 1
    fi
}

# Test microservice endpoints
test_microservice() {
    log_info "Testing microservice endpoints..."
    
    # Test health endpoint
    if curl -s -f "$MICROSERVICE_URL/health" | jq -e '.status == "healthy"' > /dev/null; then
        log_success "Health check passed"
    else
        log_error "Health check failed"
        return 1
    fi
    
    # Test models endpoint
    if curl -s -f "$MICROSERVICE_URL/models" | jq -e 'length > 0' > /dev/null; then
        log_success "Models endpoint working"
    else
        log_error "Models endpoint failed"
        return 1
    fi
    
    # Test rerank endpoint
    log_info "Testing rerank endpoint..."
    local test_payload='{
        "query": "machine learning algorithms",
        "documents": [
            {
                "id": "doc1",
                "content": "Machine learning is a subset of artificial intelligence.",
                "title": "ML Introduction"
            },
            {
                "id": "doc2", 
                "content": "Deep learning uses neural networks with multiple layers.",
                "title": "Deep Learning"
            }
        ],
        "model": "monot5",
        "domain": "'$TEST_DOMAIN'"
    }'
    
    local response=$(curl -s -X POST "$MICROSERVICE_URL/rerank" \
        -H "Content-Type: application/json" \
        -d "$test_payload")
    
    if echo "$response" | jq -e '.id and .ranking_data.candidates' > /dev/null; then
        log_success "Rerank endpoint working"
        echo "$response" | jq '.ranking_data.candidates | length' | xargs -I {} log_info "Ranked {} documents"
    else
        log_error "Rerank endpoint failed"
        echo "$response" | jq '.' || echo "$response"
        return 1
    fi
}

# Test Supabase edge functions
test_edge_functions() {
    log_info "Testing Supabase edge functions..."
    
    # Check if Supabase is running
    if ! curl -s -f "$SUPABASE_URL/rest/v1/" > /dev/null; then
        log_error "Supabase is not running at $SUPABASE_URL"
        log_info "Please start Supabase with: supabase start"
        return 1
    fi
    
    log_success "Supabase is running"
    
    # Note: Edge function tests would require authentication
    # This is a placeholder for when we have proper test setup
    log_info "Edge function tests require authentication setup"
}

# Test database migrations
test_database() {
    log_info "Testing database migrations..."
    
    # Check if rankllm_results table exists
    local table_check=$(curl -s "$SUPABASE_URL/rest/v1/rankllm_results?select=id&limit=1" \
        -H "apikey: $SUPABASE_ANON_KEY" 2>/dev/null || echo "error")
    
    if [[ "$table_check" != "error" ]]; then
        log_success "rankllm_results table exists"
    else
        log_error "rankllm_results table not found"
        log_info "Please run: supabase db reset"
        return 1
    fi
}

# Test frontend components
test_frontend() {
    log_info "Testing frontend components..."
    
    # Check if TypeScript compiles
    if npm run build > /dev/null 2>&1; then
        log_success "Frontend builds successfully"
    else
        log_error "Frontend build failed"
        return 1
    fi
    
    # Check if tests pass
    if npm run test:run > /dev/null 2>&1; then
        log_success "Frontend tests pass"
    else
        log_error "Frontend tests failed"
        return 1
    fi
}

# Performance test
test_performance() {
    log_info "Running performance test..."
    
    local start_time=$(date +%s)
    
    local test_payload='{
        "query": "performance test query",
        "documents": [
            {"id": "doc1", "content": "Test document 1 content"},
            {"id": "doc2", "content": "Test document 2 content"},
            {"id": "doc3", "content": "Test document 3 content"}
        ],
        "model": "monot5",
        "domain": "'$TEST_DOMAIN'"
    }'
    
    curl -s -X POST "$MICROSERVICE_URL/rerank" \
        -H "Content-Type: application/json" \
        -d "$test_payload" > /dev/null
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    if [[ $duration -lt 30 ]]; then
        log_success "Performance test passed (${duration}s)"
    else
        log_error "Performance test failed (${duration}s > 30s)"
        return 1
    fi
}

# Main test execution
main() {
    log_info "Starting RankLLM integration tests..."
    
    local failed_tests=0
    
    # Run tests
    check_microservice || ((failed_tests++))
    test_microservice || ((failed_tests++))
    test_database || ((failed_tests++))
    test_frontend || ((failed_tests++))
    test_performance || ((failed_tests++))
    
    # Edge functions test (optional for now)
    test_edge_functions || log_info "Edge function tests skipped (requires auth setup)"
    
    # Summary
    echo ""
    if [[ $failed_tests -eq 0 ]]; then
        log_success "All tests passed! 🎉"
        echo ""
        log_info "Next steps:"
        echo "1. Deploy microservice to production server"
        echo "2. Configure RANKLLM_SERVICE_URL in Supabase"
        echo "3. Test with real users"
        exit 0
    else
        log_error "$failed_tests test(s) failed"
        echo ""
        log_info "Troubleshooting:"
        echo "1. Make sure microservice is running: cd rank-llm-service && docker-compose up"
        echo "2. Make sure Supabase is running: supabase start"
        echo "3. Check logs for detailed error messages"
        exit 1
    fi
}

# Run main function
main "$@"
