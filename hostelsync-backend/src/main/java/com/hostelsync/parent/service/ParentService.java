package com.hostelsync.parent.service;

import com.hostelsync.parent.dto.ParentDashboardDto;

public interface ParentService {

    ParentDashboardDto getParentDashboard(String parentEmail);
}
