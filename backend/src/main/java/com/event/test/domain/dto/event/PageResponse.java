package com.event.test.domain.dto.event;

import java.util.List;

public record PageResponse<T>(List<T> items, int page, int limit, long total, int totalPages) {
}
