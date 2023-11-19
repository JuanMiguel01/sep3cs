/* Copyright (c) 2023-2025
 * This file is part of sep3cs.
 *
 * sep3cs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * sep3cs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with sep3cs. If not, see <http://www.gnu.org/licenses/>.
 */
import { Pager } from './Pager'
import { Table } from 'reactstrap'
import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

export function Players ()
{
  const { initialPage } = useParams ()
  const [ activePage, setActivePage ] = useState (initialPage ? initialPage : 0)
  const [ hasNextPage, setHasNextPage ] = useState (false)
  const [ hasPreviousPage, setHasPreviousPage ] = useState (false)
  const [ isLoading, setIsLoading ] = useState (false)
  const [ items, setItems ] = useState (undefined)
  const [ totalPages, setTotalPages ] = useState (0)

  const pageSize = 10
  const visibleIndices = 5

  useEffect (() =>
    {
      const lastPage = async () =>
        {
          //const paginatedList = await playersClient.getWithPagination (1, pageSize)
          //return paginatedList.totalPages
          return 0;
        }

      const refreshPage = async () =>
        {
          //const paginatedList = await playersClient.getWithPagination (activePage + 1, pageSize)
          //setHasNextPage (paginatedList.hasNextPage)
          //setHasPreviousPage (paginatedList.hasPreviousPage)
          //setItems (paginatedList.items)
          //setTotalPages (paginatedList.totalPages)

          setHasNextPage (false)
          setHasPreviousPage (false)
          setItems (undefined)
          setTotalPages (0)
        }

      if (activePage >= 0)
        {
          setIsLoading (true)
          refreshPage ().then (() => setIsLoading (false))
        }
      else
        {
          lastPage ().then ((total) =>
            {
              if (total === 0)
                setActivePage (0)
              else
                setActivePage (total - 1)
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePage])

  return (
    (isLoading)
    ? (<div></div>)
    : (
      <>
        <div className='d-flex justify-content-center'>
          <Pager
            activePage={activePage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChanged={(index) => setActivePage (index)}
            totalPages={totalPages}
            visibleIndices={visibleIndices} />
        </div>
        <Table>
          <thead>
            <tr>
              <th>{'#'}</th>
              <th>{'Name'}</th>
              <th>{'Nick'}</th>
              <th>{'Level'}</th>
            </tr>
          </thead>
          <tbody>
    {
      (items ?? []).map ((item) =>
        {
          return (
            <tr>
              <th scope="row"></th>
              <td></td>
              <td></td>
              <td></td>
            </tr>)
        })
    }
          </tbody>
        </Table>
      </>
    )
  )
}
